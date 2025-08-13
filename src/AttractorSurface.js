import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ATTRACTORS } from "./AttractorRegistry.js";

// =============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =============================================================================
export class RNG {
    constructor(seed = 123456789) {
        this.setSeed(seed);
    }

    setSeed(seed) {
        this._state = seed >>> 0 || 1;
    }

    random() {
        let t = (this._state += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    float(min = 0, max = 1) {
        return min + (max - min) * this.random();
    }

    int(min, max) {
        return Math.floor(this.float(min, max + 1));
    }
}

// =============================================================================
// ATTRACTOR SURFACE CLASS
// =============================================================================
export default class AttractorSurface {
    constructor(attractorName = "aizawa", rngInstance) {
        this.rng = rngInstance;
        this._initializeParams();
        this.setAttractor(attractorName, true, this.rng);
    }

    _initializeParams() {
        this.params = {
            ribbonWidth: 1,
            smoothing: 1,
            surfaceMode: "smooth",
            dtSmall: 0.002,
            oversample: 50,
            numPoints: 1500,
            maxPoints: 750,
            size: 3.5,
        };
    }

    setAttractor(name, randomize = false, rngInstance = this.rng) {
        this.rng = rngInstance || this.rng;
        this.attractorKey = name;
        
        const attractorConfig = ATTRACTORS[name];
        if (!attractorConfig) {
            throw new Error(`Unknown attractor: ${name}`);
        }

        this._setModelParams(attractorConfig, randomize);
        this._applyNumericSettings(attractorConfig);
        this._setStartPosition(attractorConfig, randomize);
        
        this.component = attractorConfig.component;
    }

    _setModelParams(config, randomize) {
        this.modelParams = { ...config.defaults };
        
        if (randomize && config.ranges) {
            for (const key in config.ranges) {
                const [min, max] = config.ranges[key];
                this.modelParams[key] = this.rng.float(min, max);
            }
        }
    }

    _applyNumericSettings(config) {
        if (config.numeric?.dt) this.params.dtSmall = config.numeric.dt;
        if (config.numeric?.oversample) this.params.oversample = config.numeric.oversample;
        if (config.numeric?.numPoints) this.params.numPoints = config.numeric.numPoints;
        if (config.numeric?.size) this.params.size = config.numeric.size;
        
        this._setMaxPoints(config);
    }

    _setMaxPoints(config) {
        if (config.numeric?.maxPoints) {
            this.params.maxPoints = config.numeric.maxPoints;
        } else if (config.numeric?.maxPointsRatio) {
            this.params.maxPoints = Math.max(2, Math.floor(this.params.numPoints * config.numeric.maxPointsRatio));
        } else {
            this.params.maxPoints = Math.max(2, Math.floor(this.params.numPoints * 0.5));
        }
    }

    _setStartPosition(config, randomize) {
        if (randomize && config.ranges?.startX && config.ranges?.startY && config.ranges?.startZ) {
            this.params.start = [
                this.rng.float(...config.ranges.startX),
                this.rng.float(...config.ranges.startY),
                this.rng.float(...config.ranges.startZ),
            ];
        } else if (config.defaults?.start) {
            this.params.start = [...config.defaults.start];
        } else {
            this.params.start = [1, -1, 1];
        }
    }

    integrateRK4(start, steps, dt) {
        const points = [];
        let { x, y, z } = start;
        
        const addPoint = () => {
            points.push(new THREE.Vector3(
                x * this.params.size, 
                y * this.params.size, 
                z * this.params.size
            ));
        };
        
        addPoint();

        for (let i = 0; i < steps; i++) {
            const { x: newX, y: newY, z: newZ } = this._rungeKuttaStep(x, y, z, dt);
            x = newX;
            y = newY;
            z = newZ;

            if (!this._isValidPoint(x, y, z)) {
                x = this.rng.float(-1, 1);
                y = this.rng.float(-1, 1);
                z = this.rng.float(-1, 1);
            }
            
            addPoint();
        }
        
        return points;
    }

    _rungeKuttaStep(x, y, z, dt) {
        const k1 = this.component(x, y, z, this.modelParams);
        const k2 = this.component(
            x + k1.x * dt * 0.5, 
            y + k1.y * dt * 0.5, 
            z + k1.z * dt * 0.5, 
            this.modelParams
        );
        const k3 = this.component(
            x + k2.x * dt * 0.5, 
            y + k2.y * dt * 0.5, 
            z + k2.z * dt * 0.5, 
            this.modelParams
        );
        const k4 = this.component(
            x + k3.x * dt, 
            y + k3.y * dt, 
            z + k3.z * dt, 
            this.modelParams
        );

        return {
            x: x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
            y: y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
            z: z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z)
        };
    }

    _isValidPoint(x, y, z) {
        return isFinite(x) && isFinite(y) && isFinite(z);
    }

    totalArcLength(points) {
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            length += points[i].distanceTo(points[i - 1]);
        }
        return length;
    }

    resampleByArcLength(points, spacing) {
        if (points.length < 2) return points.slice();
        
        const filtered = this._filterTinySegments(points, spacing * 1e-3);
        if (filtered.length < 2) return filtered;

        return this._uniformResample(filtered, spacing);
    }

    _filterTinySegments(points, epsilon) {
        const filtered = [points[0].clone()];
        
        for (let i = 1; i < points.length; i++) {
            const lastPoint = filtered[filtered.length - 1];
            if (points[i].distanceTo(lastPoint) > epsilon) {
                filtered.push(points[i].clone());
            }
        }
        
        return filtered;
    }

    _uniformResample(points, spacing) {
        const resampled = [points[0].clone()];
        let accumulatedLength = 0;
        let targetDistance = 0;

        for (let i = 1; i < points.length; i++) {
            const currentPoint = points[i - 1];
            const nextPoint = points[i];
            const segment = nextPoint.clone().sub(currentPoint);
            const segmentLength = segment.length();

            while (accumulatedLength + segmentLength >= targetDistance + spacing) {
                const t = (targetDistance + spacing - accumulatedLength) / segmentLength;
                const interpolatedPoint = currentPoint.clone().addScaledVector(segment, t);
                resampled.push(interpolatedPoint);
                targetDistance += spacing;
            }
            
            accumulatedLength += segmentLength;
        }

        const lastPoint = points[points.length - 1];
        const finalPoint = resampled[resampled.length - 1];
        if (!finalPoint.equals(lastPoint)) {
            resampled.push(lastPoint.clone());
        }
        
        return resampled;
    }

    buildRibbonEdges(centerPoints) {
        const halfWidth = this.params.ribbonWidth * 0.5;
        const topEdgePoints = [];
        const bottomEdgePoints = [];

        if (centerPoints.length < 2) {
            return { topEdgePoints, bottomEdgePoints };
        }

        const frame = this._initializeRibbonFrame(centerPoints);
        
        for (let i = 0; i < centerPoints.length; i++) {
            if (i < centerPoints.length - 1) {
                this._updateRibbonFrame(frame, centerPoints, i);
            }

            const offset = frame.normal.clone().multiplyScalar(halfWidth);
            const center = centerPoints[i];
            
            topEdgePoints.push(center.clone().add(offset));
            bottomEdgePoints.push(center.clone().sub(offset));
        }

        return { topEdgePoints, bottomEdgePoints };
    }

    _initializeRibbonFrame(centerPoints) {
        const initialTangent = new THREE.Vector3()
            .subVectors(centerPoints[1], centerPoints[0])
            .normalize();

        const referenceVectors = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1)
        ];
        
        const bestReference = referenceVectors.reduce((best, current) => 
            Math.abs(current.dot(initialTangent)) < Math.abs(best.dot(initialTangent)) 
                ? current : best
        );

        return {
            tangent: initialTangent.clone(),
            normal: new THREE.Vector3().crossVectors(initialTangent, bestReference).normalize()
        };
    }

    _updateRibbonFrame(frame, centerPoints, index) {
        const nextTangent = new THREE.Vector3()
            .subVectors(centerPoints[index + 1], centerPoints[index])
            .normalize();

        const rotationAxis = new THREE.Vector3().crossVectors(frame.tangent, nextTangent);
        const sinTheta = rotationAxis.length();
        const cosTheta = THREE.MathUtils.clamp(frame.tangent.dot(nextTangent), -1, 1);

        if (sinTheta > 1e-6) {
            rotationAxis.normalize();
            const angle = Math.atan2(sinTheta, cosTheta);
            const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
            frame.normal.applyQuaternion(quaternion);
        }
        
        frame.tangent.copy(nextTangent);
    }

    makeAttractorUniform() {
        const [x, y, z] = this.params.start;
        const denseSteps = Math.max(
            this.params.numPoints * this.params.oversample, 
            this.params.numPoints + 5
        );
        
        const rawCenterPoints = this.integrateRK4({ x, y, z }, denseSteps, this.params.dtSmall);
        const totalLength = this.totalArcLength(rawCenterPoints);
        const spacing = totalLength / Math.max(this.params.numPoints - 1, 1);
        
        const centerPoints = this.resampleByArcLength(rawCenterPoints, spacing);
        const { topEdgePoints, bottomEdgePoints } = this.buildRibbonEdges(centerPoints);
        
        return { centerPoints, topEdgePoints, bottomEdgePoints };
    }

    createSurface(topEdgePoints, bottomEdgePoints) {
        const pointCount = Math.min(topEdgePoints.length, bottomEdgePoints.length);
        const usePointCount = Math.min(pointCount, this.params.maxPoints);
        
        if (usePointCount < 2) return null;

        const geometry = this._createSurfaceGeometry(topEdgePoints, bottomEdgePoints, usePointCount);
        geometry.computeVertexNormals();
        
        return geometry;
    }

    _createSurfaceGeometry(topEdgePoints, bottomEdgePoints, pointCount) {
        const vertexCount = pointCount * 2;
        const positions = new Float32Array(vertexCount * 3);

        // Create vertices (top and bottom pairs)
        let positionIndex = 0;
        for (let i = 0; i < pointCount; i++) {
            const top = topEdgePoints[i];
            const bottom = bottomEdgePoints[i];

            // Top vertex (with coordinate swap: y <-> z)
            positions[positionIndex++] = top.x;
            positions[positionIndex++] = top.z;
            positions[positionIndex++] = top.y;
            
            // Bottom vertex
            positions[positionIndex++] = bottom.x;
            positions[positionIndex++] = bottom.z;
            positions[positionIndex++] = bottom.y;
        }

        // Create triangular faces
        const triangleCount = (pointCount - 1) * 2;
        const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
        const indices = new IndexArray(triangleCount * 3);

        let indexPos = 0;
        for (let i = 0; i < pointCount - 1; i++) {
            const topCurrent = i * 2;
            const bottomCurrent = i * 2 + 1;
            const topNext = (i + 1) * 2;
            const bottomNext = (i + 1) * 2 + 1;

            // First triangle
            indices[indexPos++] = topCurrent;
            indices[indexPos++] = bottomCurrent;
            indices[indexPos++] = topNext;

            // Second triangle
            indices[indexPos++] = topNext;
            indices[indexPos++] = bottomCurrent;
            indices[indexPos++] = bottomNext;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        
        return geometry;
    }

    createFrontGridGeometry(topEdgePoints, bottomEdgePoints) {
        const pointCount = Math.min(topEdgePoints.length, bottomEdgePoints.length);
        const usePointCount = Math.min(pointCount, this.params.maxPoints);
        
        if (usePointCount < 2) return null;

        const gridParts = [];
        const gridHelper = this._createGridHelper(topEdgePoints, bottomEdgePoints, usePointCount);

        if (this.params.gridShowU) {
            this._addUGridLines(gridParts, gridHelper, usePointCount, topEdgePoints, bottomEdgePoints);
        }

        if (this.params.gridShowV) {
            this._addVGridLines(gridParts, gridHelper, usePointCount, topEdgePoints, bottomEdgePoints);
        }

        if (gridParts.length === 0) return null;

        const mergedGeometry = mergeGeometries(gridParts, false);
        mergedGeometry.computeVertexNormals();
        
        return mergedGeometry;
    }

    _createGridHelper(topEdgePoints, bottomEdgePoints, pointCount) {
        const halfWidth = this.params.ribbonWidth * 0.5;
        const thickness = Math.max(1e-4, this.params.gridThickness) * this.params.ribbonWidth;
        const liftHeight = this.params.gridHeight ?? 0.02;

        const helper = {
            getCenterAt: (i) => new THREE.Vector3(
                0.5 * (topEdgePoints[i].x + bottomEdgePoints[i].x),
                0.5 * (topEdgePoints[i].y + bottomEdgePoints[i].y),
                0.5 * (topEdgePoints[i].z + bottomEdgePoints[i].z)
            ),
            getWidthDirAt: (i) => new THREE.Vector3()
                .subVectors(topEdgePoints[i], bottomEdgePoints[i])
                .normalize(),
            getTangentAt: (i) => {
                const i0 = Math.max(0, i - 1);
                const i1 = Math.min(pointCount - 1, i + 1);
                const center0 = helper.getCenterAt(i0);
                const center1 = helper.getCenterAt(i1);
                return new THREE.Vector3().subVectors(center1, center0).normalize();
            },
            getNormalAt: (i) => {
                const tangent = helper.getTangentAt(i);
                const widthDir = helper.getWidthDirAt(i);
                return new THREE.Vector3().crossVectors(tangent, widthDir).normalize();
            },
            thickness,
            liftHeight
        };

        return helper;
    }

    _addUGridLines(gridParts, helper, pointCount, topEdgePoints, bottomEdgePoints) {
        const uCount = Math.max(1, this.params.gridU | 0);
        
        for (let uj = 1; uj < uCount; uj++) {
            const v = uj / uCount;
            const { edgePlus, edgeMinus } = this._createUGridEdges(helper, pointCount, v, topEdgePoints, bottomEdgePoints);
            const strip = this._createGridStrip(edgePlus, edgeMinus);
            
            if (strip) gridParts.push(strip);
        }
    }

    _createUGridEdges(helper, pointCount, v, topEdgePoints, bottomEdgePoints) {
        const edgePlus = [];
        const edgeMinus = [];

        for (let i = 0; i < pointCount; i++) {
            const top = topEdgePoints[i];
            const bottom = bottomEdgePoints[i];
            const base = new THREE.Vector3().lerpVectors(top, bottom, v);
            const normal = helper.getNormalAt(i);
            
            base.addScaledVector(normal, helper.liftHeight);

            const widthDir = helper.getWidthDirAt(i);
            const offset = widthDir.clone().multiplyScalar(helper.thickness * 0.5);
            
            edgePlus.push(base.clone().add(offset));
            edgeMinus.push(base.clone().sub(offset));
        }

        return { edgePlus, edgeMinus };
    }

    _addVGridLines(gridParts, helper, pointCount, topEdgePoints, bottomEdgePoints) {
        const vCount = Math.max(1, this.params.gridV | 0);
        const step = Math.max(1, Math.floor(pointCount / (vCount + 1)));
        
        for (let i = step; i < pointCount - step; i += step) {
            const { edgePlus, edgeMinus } = this._createVGridEdges(helper, i, topEdgePoints, bottomEdgePoints);
            const strip = this._createGridStrip(edgePlus, edgeMinus);
            
            if (strip) gridParts.push(strip);
        }
    }

    _createVGridEdges(helper, index, topEdgePoints, bottomEdgePoints) {
        const top = topEdgePoints[index];
        const bottom = bottomEdgePoints[index];
        const normal = helper.getNormalAt(index);

        const topLifted = top.clone().addScaledVector(normal, helper.liftHeight);
        const bottomLifted = bottom.clone().addScaledVector(normal, helper.liftHeight);

        const tangent = helper.getTangentAt(index);
        const offset = tangent.clone().multiplyScalar(helper.thickness * 0.5);

        const edgePlus = [
            topLifted.clone().add(offset), 
            bottomLifted.clone().add(offset)
        ];
        const edgeMinus = [
            topLifted.clone().sub(offset), 
            bottomLifted.clone().sub(offset)
        ];

        return { edgePlus, edgeMinus };
    }

    _createGridStrip(edgeA, edgeB) {
        const pointCount = Math.min(edgeA.length, edgeB.length);
        if (pointCount < 2) return null;

        const vertexCount = pointCount * 2;
        const positions = new Float32Array(vertexCount * 3);
        
        let posIndex = 0;
        for (let i = 0; i < pointCount; i++) {
            const a = edgeA[i];
            const b = edgeB[i];
            
            // Coordinate swap: y <-> z
            positions[posIndex++] = a.x;
            positions[posIndex++] = a.z;
            positions[posIndex++] = a.y;
            positions[posIndex++] = b.x;
            positions[posIndex++] = b.z;
            positions[posIndex++] = b.y;
        }

        const triangleCount = (pointCount - 1) * 2;
        const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
        const indices = new IndexArray(triangleCount * 3);
        
        let indexPos = 0;
        for (let i = 0; i < pointCount - 1; i++) {
            const topCurrent = i * 2;
            const bottomCurrent = i * 2 + 1;
            const topNext = (i + 1) * 2;
            const bottomNext = (i + 1) * 2 + 1;
            
            indices[indexPos++] = topCurrent;
            indices[indexPos++] = bottomCurrent;
            indices[indexPos++] = topNext;
            indices[indexPos++] = topNext;
            indices[indexPos++] = bottomCurrent;
            indices[indexPos++] = bottomNext;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();
        
        return geometry;
    }
}