import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ProjectionGenerator } from "./ProjectionGenerator.js";
import { ProjectionGeneratorWorker } from "../src/worker/ProjectionGeneratorWorker.js";
import { generateEdges } from "../src/utils/generateEdges.js";
import { ProjectionSVGExporter } from "./ProjectionSVGExporter.js";
import { ATTRACTORS } from "./AttractorRegistry.js";
import AttractorSurface, { RNG } from "./AttractorSurface.js";

// =============================================================================
// CONSTANTS
// =============================================================================
const ANGLE_THRESHOLD = 50;

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================
let renderer, camera, scene, gui, controls;
let model, projection, group;
let outputContainer;
let worker;
let task = null;
let svgExporter;
let attractorSurface;

// =============================================================================
// PARAMETERS AND STATE
// =============================================================================
const params = {
    seed: 0,
    renderMode: "flat",
    
    gridShowU: true,
    gridShowV: true,
    gridU: 4,
    gridV: 12,
    gridThickness: 0.08,
    gridHeight: 0.02,

    sortEdges: true,
    includeIntersectionEdges: true,
    useWorker: true,

    view3DModel: true,
    modelRotationX: 0,
    modelRotationY: 0,
    modelRotationZ: 0,

    svgMaxSize: 1000,
    svgLineWidth: 1,
    svgLineColor: "#030303",
    svgBackgroundColor: "#ffffff",

    // Action methods
    reseed: () => handleReseed(),
    randomSeed: () => handleRandomSeed(),
    randomRotate: () => handleRandomRotate(),
    regenerateProjection: () => handleRegenerateProjection(),
    exportSVG: () => handleExportSVG(),
};

let initialSeed = (Math.random() * 0xffffffff) >>> 0;
let rng = new RNG(initialSeed);
params.seed = initialSeed;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
function randomQuaternionFromRNG(rngInstance = rng) {
    const u1 = rngInstance.random();
    const u2 = rngInstance.random();
    const u3 = rngInstance.random();
    const s1 = Math.sqrt(1 - u1);
    const s2 = Math.sqrt(u1);
    const theta1 = 2 * Math.PI * u2;
    const theta2 = 2 * Math.PI * u3;
    
    return new THREE.Quaternion(
        s1 * Math.sin(theta1),
        s1 * Math.cos(theta1),
        s2 * Math.sin(theta2),
        s2 * Math.cos(theta2),
    );
}

function centerModelInGroup() {
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);

    const box = new THREE.Box3();
    box.setFromObject(model, true);
    box.getCenter(group.position).multiplyScalar(-1);
    group.position.y = Math.max(0, -box.min.y) + 1;
}

function updateModelRotationFromParams() {
    if (!group || !model) return;

    const rx = THREE.MathUtils.degToRad(params.modelRotationX);
    const ry = THREE.MathUtils.degToRad(params.modelRotationY);
    const rz = THREE.MathUtils.degToRad(params.modelRotationZ);

    group.rotation.set(rx, ry, rz);
    centerModelInGroup();
}

function syncGridParamsToAttractor() {
    Object.assign(attractorSurface.params, {
        gridShowU: params.gridShowU,
        gridShowV: params.gridShowV,
        gridU: params.gridU,
        gridV: params.gridV,
        gridThickness: params.gridThickness,
        gridHeight: params.gridHeight,
    });
}

function updateGUIControllers() {
    if (gui) {
        gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    }
}

// =============================================================================
// ATTRACTOR CREATION
// =============================================================================
function createAttractor() {
    if (!attractorSurface) {
        attractorSurface = new AttractorSurface(undefined, rng);
    }

    const { topEdgePoints, bottomEdgePoints } = attractorSurface.makeAttractorUniform();
    const group = new THREE.Group();

    addSurfaceToGroup(group, topEdgePoints, bottomEdgePoints);
    addGridToGroup(group, topEdgePoints, bottomEdgePoints);

    return group;
}

function addSurfaceToGroup(group, topEdgePoints, bottomEdgePoints) {
    if (params.renderMode === "ribbons") return;

    const surfaceGeometry = attractorSurface.createSurface(topEdgePoints, bottomEdgePoints);
    if (!surfaceGeometry) return;

    const surfaceMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(1.0, 1.0, 1.0),
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
    });

    group.add(new THREE.Mesh(surfaceGeometry, surfaceMaterial));
}

function addGridToGroup(group, topEdgePoints, bottomEdgePoints) {
    if (params.renderMode === "flat") return;

    const gridGeometry = attractorSurface.createFrontGridGeometry(topEdgePoints, bottomEdgePoints);
    if (!gridGeometry) return;

    const gridMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
    });

    group.add(new THREE.Mesh(gridGeometry, gridMaterial));
}

// =============================================================================
// PARAMETER HANDLERS
// =============================================================================
function handleReseed() {
    rng.setSeed(params.seed >>> 0);
    attractorSurface = null;
    generateGeometry();
    task = updateEdges();
}

function handleRandomSeed() {
    const newSeed = (Math.random() * 0xffffffff) >>> 0;
    params.seed = newSeed;
    rng.setSeed(newSeed);
    attractorSurface = null;
    updateGUIControllers();
    generateGeometry();
    task = updateEdges();
}

function handleRandomRotate() {
    const quaternion = randomQuaternionFromRNG(rng);
    group.quaternion.copy(quaternion);
    centerModelInGroup();

    const euler = new THREE.Euler().setFromQuaternion(group.quaternion);
    params.modelRotationX = THREE.MathUtils.radToDeg(euler.x);
    params.modelRotationY = THREE.MathUtils.radToDeg(euler.y);
    params.modelRotationZ = THREE.MathUtils.radToDeg(euler.z);

    updateGUIControllers();
    task = updateEdges();
}

function handleRegenerateProjection() {
    task = updateEdges();
}

function handleExportSVG() {
    exportProjectionToSVG();
}

// =============================================================================
// GEOMETRY GENERATION
// =============================================================================
function generateGeometry() {
    if (model) {
        group.remove(model);
    }

    if (!attractorSurface) {
        attractorSurface = new AttractorSurface(undefined, rng);
    }

    syncGridParamsToAttractor();
    resetModelRotation();
    
    model = new THREE.Group();
    model.visible = params.view3DModel;
    model.add(createAttractor());

    group.rotation.set(0, 0, 0);
    group.updateMatrixWorld(true);
    centerModelInGroup();
    group.add(model);

    updateGUIControllers();
}

function resetModelRotation() {
    params.modelRotationX = 0;
    params.modelRotationY = 0;
    params.modelRotationZ = 0;
}

// =============================================================================
// GUI SETUP
// =============================================================================
function setupGUI() {
    gui = new GUI({ width: 350 });

    setupModeFolder();
    setupSeedFolder();
    setupRotationFolder();
    // setupSVGFolder();
    setupGridFolder();
    setupActionButtons();
}

function setupModeFolder() {
    const modeFolder = gui.addFolder("Surface Mode");
    modeFolder
        .add(params, "renderMode", ["flat", "ribbons"])
        .name("Mode")
        .onChange(() => {
            generateGeometry();
            task = updateEdges();
        });
    modeFolder.open();
}

function setupSeedFolder() {
    const seedFolder = gui.addFolder("Seed");
    seedFolder.add(params, "seed", 0, 0xffffffff).step(1).name("Seed");
    seedFolder.add(params, "reseed").name("Apply Seed");
    seedFolder.add(params, "randomSeed").name("Random Seed / Re-Generate");
    seedFolder.open();
}

function setupRotationFolder() {
    const rotationFolder = gui.addFolder("Model Rotation");
    rotationFolder.add(params, "view3DModel").onChange(visible => {
        if (model) model.visible = visible;
    });
    rotationFolder.add(params, "modelRotationX", -180, 180).step(1).name("Rotation X").onChange(updateModelRotationFromParams);
    rotationFolder.add(params, "modelRotationY", -180, 180).step(1).name("Rotation Y").onChange(updateModelRotationFromParams);
    rotationFolder.add(params, "modelRotationZ", -180, 180).step(1).name("Rotation Z").onChange(updateModelRotationFromParams);
    rotationFolder.add(params, "regenerateProjection").name("Update Projection");
    rotationFolder.add(params, "randomRotate").name("Random Rotate");
    rotationFolder.open();
}

function setupSVGFolder() {
    const svgFolder = gui.addFolder("SVG Export Settings");
    svgFolder.add(params, "svgMaxSize", 500, 3000).step(100).name("Max Size").onChange(updateSVGExporter);
    svgFolder.add(params, "svgLineWidth", 0.5, 5).step(0.5).name("Line Width").onChange(updateSVGExporter);
    svgFolder.addColor(params, "svgLineColor").name("Line Color").onChange(updateSVGExporter);
    svgFolder.addColor(params, "svgBackgroundColor").name("Background").onChange(updateSVGExporter);
    svgFolder.close();
}

function setupGridFolder() {
    const gridFolder = gui.addFolder("Setup Ribbons");

    gridFolder.add(params, "gridShowU").name("U lines");
    gridFolder.add(params, "gridShowV").name("V lines");
    gridFolder.add(params, "gridU", 2, 8, 1).name("U count");
    gridFolder.add(params, "gridV", 2, 500, 1).name("V count");
    gridFolder.add(params, "gridThickness", 0.01, 0.3, 0.01).name("Thickness");
    gridFolder.add(params, "gridHeight", 0.0, 0.2, 0.005).name("Lift");

    // Add instruction label with bright color
    const instructionController = gridFolder.add({ info: "Change Param. -> click Apply" }, "info")
        .name("Instructions").disable();
    
    // Apply bright yellow color - let's debug the DOM structure first
    setTimeout(() => {
        const inputElement = instructionController.domElement.querySelector('input');
        if (inputElement) {
            inputElement.style.color = '#ffff00';
            inputElement.style.fontWeight = 'bold';
        }
        
        // Also try styling the entire element
        instructionController.domElement.style.color = '#ffeb3b';
        instructionController.domElement.style.fontWeight = 'bold';
    }, 0);

    gridFolder.add({ apply: applyGridChanges }, "apply").name("Apply Grid");
}

function applyGridChanges() {
    syncGridParamsToAttractor();
    generateGeometry();
    task = updateEdges();
}

function setupActionButtons() {
    gui.add(params, "exportSVG").name("Export SVG");
}

function updateSVGExporter() {
    svgExporter.options = {
        ...svgExporter.options,
        maxSize: params.svgMaxSize,
        lineWidth: params.svgLineWidth,
        lineColor: params.svgLineColor,
        backgroundColor: params.svgBackgroundColor,
    };
}

// =============================================================================
// PROJECTION UPDATES
// =============================================================================
function* updateEdges(runTime = 30) {
    outputContainer.innerText = "processing: --";

    const geometries = collectGeometries();
    if (geometries.length === 0) {
        handleNoGeometry();
        return;
    }

    const { mergedGeometry, mergeTime } = mergeGeometriesWithTiming(geometries);
    yield;

    if (params.includeIntersectionEdges) {
        outputContainer.innerText = "processing: finding edge intersections...";
        resetProjectionGeometry();
    }

    const { geometry, trimTime } = yield* processProjectionGeometry(mergedGeometry, runTime);
    
    updateProjectionDisplay(geometry);
    updateOutputDisplay(mergeTime, trimTime);
}

function collectGeometries() {
    const geometries = [];
    model.updateWorldMatrix(true, true);

    model.traverse(child => {
        if (child.geometry) {
            const clone = child.geometry.clone();
            clone.applyMatrix4(child.matrixWorld);
            
            // Keep only position attribute
            for (const key in clone.attributes) {
                if (key !== "position") {
                    clone.deleteAttribute(key);
                }
            }
            
            geometries.push(clone);
        }
    });

    return geometries;
}

function handleNoGeometry() {
    projection.geometry.dispose();
    projection.geometry = new THREE.BufferGeometry();
    outputContainer.innerText = "merge geometry  : 0ms\nedge trimming   : 0ms\n\n(no geometry)";
}

function mergeGeometriesWithTiming(geometries) {
    const timeStart = window.performance.now();
    const mergedGeometry = mergeGeometries(geometries, false);
    const mergeTime = window.performance.now() - timeStart;
    
    return { mergedGeometry, mergeTime };
}

function resetProjectionGeometry() {
    projection.geometry.dispose();
    projection.geometry = new THREE.BufferGeometry();
}

function* processProjectionGeometry(mergedGeometry, runTime) {
    const timeStart = window.performance.now();
    let geometry = null;

    if (!params.useWorker) {
        geometry = yield* processWithoutWorker(mergedGeometry, runTime);
    } else {
        geometry = yield* processWithWorker(mergedGeometry);
    }

    const trimTime = window.performance.now() - timeStart;
    return { geometry, trimTime };
}

function* processWithoutWorker(mergedGeometry, runTime) {
    const generator = new ProjectionGenerator();
    generator.sortEdges = params.sortEdges;
    generator.iterationTime = runTime;
    generator.angleThreshold = ANGLE_THRESHOLD;
    generator.includeIntersectionEdges = params.includeIntersectionEdges;

    const task = generator.generate(mergedGeometry, {
        onProgress: (progress, data) => {
            outputContainer.innerText = `processing: ${parseFloat((progress * 100).toFixed(2))}%`;
            projection.geometry.dispose();
            projection.geometry = data.getLineGeometry();
        },
    });

    let result = task.next();
    while (!result.done) {
        result = task.next();
        yield;
    }
    
    return result.value;
}

function* processWithWorker(mergedGeometry) {
    let geometry = null;
    
    worker.generate(mergedGeometry, {
        sortEdges: params.sortEdges,
        includeIntersectionEdges: params.includeIntersectionEdges,
        onProgress: progress => {
            outputContainer.innerText = `processing: ${parseFloat((progress * 100).toFixed(2))}%`;
        },
    }).then(result => {
        geometry = result;
    });

    while (geometry === null) {
        yield;
    }
    
    return geometry;
}

function updateProjectionDisplay(geometry) {
    projection.geometry.dispose();
    projection.geometry = geometry;
}

function updateOutputDisplay(mergeTime, trimTime) {
    outputContainer.innerText =
        `merge geometry  : ${mergeTime.toFixed(2)}ms\n` +
        `edge trimming   : ${trimTime.toFixed(2)}ms\n\n` +
        formatAttractorReport();
}

// =============================================================================
// ATTRACTOR REPORTING
// =============================================================================
function formatAttractorReport() {
    if (!attractorSurface) return "";

    const attractorKey = attractorSurface.attractorKey;
    const config = ATTRACTORS[attractorKey];
    const label = config?.label || attractorKey;
    const modelParams = attractorSurface.modelParams || {};
    const visualParams = attractorSurface.params || {};

    const sections = [
        `seed: ${params?.seed ?? "(none)"}`,
        `attractor: ${label} (${attractorKey})`,
        formatModelParams(modelParams, visualParams),
        "",
        formatVisualParams(visualParams)
    ];

    return sections.join("\n");
}

function formatModelParams(modelParams, visualParams) {
    const formatValue = (value, precision = 6) => 
        typeof value === "number" ? value.toFixed(precision) : String(value);
    
    const formatArray = (array, precision = 6) =>
        Array.isArray(array) 
            ? `[${array.map(v => typeof v === "number" ? v.toFixed(precision) : v).join(", ")}]`
            : String(array);

    const startLine = `start: ${formatArray(visualParams.start ?? modelParams.start ?? [1, -1, 1], 6)}`;
    
    const paramLines = Object.keys(modelParams)
        .filter(key => key !== "start")
        .sort()
        .map(key => `${key}: ${formatValue(modelParams[key])}`);

    return [
        "model params:",
        `  ${[startLine, ...paramLines].join("\n  ")}`
    ].join("\n");
}

function formatVisualParams(params) {
    const formatValue = (value, precision = 6) => 
        typeof value === "number" ? value.toFixed(precision) : String(value);

    const paramLines = [
        `dtSmall: ${formatValue(params.dtSmall)}`,
        `oversample: ${formatValue(params.oversample, 0)}`,
        `numPoints: ${formatValue(params.numPoints, 0)}`,
        `maxPoints: ${formatValue(params.maxPoints, 0)}`,
        `size: ${formatValue(params.size)}`,
        `ribbonWidth: ${formatValue(params.ribbonWidth)}`,
    ];

    return [
        "numeric/visual params:",
        `  ${paramLines.join("\n  ")}`
    ].join("\n");
}

// =============================================================================
// SVG EXPORT AND SCREENSHOT
// =============================================================================
function exportProjectionToSVG() {
    try {
        const timestamp = generateTimestamp();
        const filename = `geometric_projection_seed${params.seed}_${timestamp}.svg`;
        const result = svgExporter.exportAndDownload(projection, filename);

        console.log(`Export completed: ${result.filename}`);
        console.log(`Lines exported: ${result.lineCount}`);

        updateOutputWithExportInfo(result);
        exportFullScreenAll();
    } catch (error) {
        console.error("SVG Export failed:", error);
        outputContainer.innerText += `\nSVG Export failed: ${error.message}`;
    }
}

function generateTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}` +
           `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
}

function updateOutputWithExportInfo(result) {
    const stats = svgExporter.getProjectionStats(projection);
    if (stats) {
        outputContainer.innerText += `\nSVG exported: ${result.lineCount} lines, ${stats.bounds.aspectRatio.toFixed(3)} aspect ratio`;
    }
}

async function ensureHtml2Canvas() {
    if (window.html2canvas) return;
    
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function captureDisplayOnce(filename = `screencap_${Date.now()}.jpg`) {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    const image = new ImageCapture(track);
    const bitmap = await image.grabFrame();
    
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    track.stop();

    downloadCanvasAsImage(canvas, filename, "image/jpeg", 0.95);
}

async function exportFullScreenAll(filename = null) {
    const timestamp = generateTimestamp();
    const fname = filename || `geometric_projection_seed${params.seed}_${timestamp}.jpg`;

    renderer.render(scene, camera);

    try {
        const baseImage = await captureWebGLCanvas();
        const overlayCanvas = await captureHTMLOverlay();
        const compositeCanvas = createCompositeImage(baseImage, overlayCanvas);
        
        downloadCanvasAsImage(compositeCanvas, fname, "image/jpeg", 0.95);
    } catch (error) {
        console.warn("Full screen capture failed, using fallback", error);
        await captureDisplayOnce(fname);
    }
}

async function captureWebGLCanvas() {
    const oldClear = renderer.getClearColor(new THREE.Color());
    const oldAlpha = renderer.getClearAlpha();
    
    renderer.setClearColor(0xffffff, 1);
    renderer.render(scene, camera);
    
    const dataURL = renderer.domElement.toDataURL("image/png");
    renderer.setClearColor(oldClear, oldAlpha);
    
    const image = new Image();
    image.src = dataURL;
    await image.decode();
    
    return image;
}

async function captureHTMLOverlay() {
    await ensureHtml2Canvas();
    
    const scale = window.devicePixelRatio || 1;
    
    return await window.html2canvas(document.body, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: false,
        ignoreElements: () => false,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        x: 0,
        y: 0,
        scale,
        logging: false,
    });
}

function createCompositeImage(baseImage, overlayCanvas) {
    const scale = window.devicePixelRatio || 1;
    const outputWidth = Math.round(window.innerWidth * scale);
    const outputHeight = Math.round(window.innerHeight * scale);
    
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    
    const ctx = canvas.getContext("2d");
    
    // Position WebGL canvas correctly
    const rect = renderer.domElement.getBoundingClientRect();
    const offsetX = Math.round(rect.left * scale);
    const offsetY = Math.round(rect.top * scale);
    const webglWidth = renderer.domElement.width;
    const webglHeight = renderer.domElement.height;
    
    ctx.drawImage(baseImage, offsetX, offsetY, webglWidth, webglHeight);
    ctx.drawImage(overlayCanvas, 0, 0, outputWidth, outputHeight);
    
    return canvas;
}

function downloadCanvasAsImage(canvas, filename, mimeType = "image/jpeg", quality = 0.95) {
    const dataURL = canvas.toDataURL(mimeType, quality);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =============================================================================
// INITIALIZATION AND MAIN LOOP
// =============================================================================
async function init() {
    outputContainer = document.getElementById("output");
    const bgColor = 0xeeeeee;

    initializeSVGExporter();
    initializeRenderer(bgColor);
    initializeScene();
    initializeLights();
    initializeGroup();
    
    rng.setSeed(params.seed >>> 0);
    generateGeometry();
    
    initializeProjection();
    initializeCamera();
    initializeControls();
    setupGUI();
    
    worker = new ProjectionGeneratorWorker();
    task = updateEdges();
    
    setupEventListeners();
    render();
}

function initializeSVGExporter() {
    svgExporter = new ProjectionSVGExporter({
        maxSize: params.svgMaxSize,
        lineWidth: params.svgLineWidth,
        lineColor: params.svgLineColor,
        backgroundColor: params.svgBackgroundColor,
    });
}

function initializeRenderer(bgColor) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(bgColor, 1);
    document.body.appendChild(renderer.domElement);
}

function initializeScene() {
    scene = new THREE.Scene();
}

function initializeLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xb0bec5, 0.5);
    scene.add(ambientLight);
}

function initializeGroup() {
    group = new THREE.Group();
    scene.add(group);
}

function initializeProjection() {
    projection = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xa30303 })
    );
    projection.position.y = -5.0;
    scene.add(projection);
}

function initializeCamera() {
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 2500);
    camera.position.setScalar(15);
    camera.updateProjectionMatrix();
}

function initializeControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function setupEventListeners() {
    window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    requestAnimationFrame(render);

    if (task) {
        const result = task.next();
        if (result.done) {
            task = null;
        }
    }

    renderer.render(scene, camera);
}

// =============================================================================
// START APPLICATION
// =============================================================================
init();