/**
 * ProjectionSVGExporter - A module for exporting 3D projections to SVG format
 * 
 * Features:
 * - Automatic aspect ratio calculation
 * - Configurable styling
 * - XZ plane projection (Y-axis view)
 * - Proper coordinate mapping and scaling
 */

export class ProjectionSVGExporter {
    constructor(options = {}) {
        this.options = {
            maxSize: 1000,
            padding: 0.1, // 10% padding
            lineWidth: 1,
            lineColor: '#030303',
            backgroundColor: '#ffffff',
            precision: 2,
            includeBackground: true,
            ...options
        };
    }

    /**
     * Export projection geometry to SVG
     * @param {THREE.LineSegments} projection - Three.js LineSegments object
     * @param {Object} exportOptions - Export-specific options
     * @returns {string} SVG content
     */
    export(projection, exportOptions = {}) {
        if (!projection || !projection.geometry) {
            throw new Error('No valid projection geometry provided');
        }

        const options = { ...this.options, ...exportOptions };
        
        // Extract line segments from geometry
        const lines = this.extractLines(projection.geometry);
        if (lines.length === 0) {
            throw new Error('No line segments found in projection geometry');
        }

        // Calculate bounding box
        const bounds = this.calculateBounds(lines);
        
        // Calculate SVG dimensions with proper aspect ratio
        const dimensions = this.calculateSVGDimensions(bounds, options);
        
        // Project 3D lines to 2D SVG coordinates
        const projectedLines = this.projectLinesToSVG(lines, bounds, dimensions, options);
        
        // Generate SVG content
        return this.generateSVG(projectedLines, dimensions, options);
    }

    /**
     * Export and download SVG file
     * @param {THREE.LineSegments} projection - Three.js LineSegments object
     * @param {string} filename - Output filename
     * @param {Object} exportOptions - Export-specific options
     */
    exportAndDownload(projection, filename = 'projection.svg', exportOptions = {}) {
        const svgContent = this.export(projection, exportOptions);
        this.downloadSVG(svgContent, filename);
        
        const lines = this.extractLines(projection.geometry);
        console.log(`Exported ${lines.length} line segments to ${filename}`);
        
        return {
            filename,
            lineCount: lines.length,
            svgContent
        };
    }

    /**
     * Extract line segments from LineSegments geometry
     * @private
     */
    extractLines(geometry) {
        const positions = geometry.attributes.position.array;
        const lines = [];
        
        for (let i = 0; i < positions.length; i += 6) {
            const start = {
                x: positions[i],
                y: positions[i + 1], 
                z: positions[i + 2]
            };
            const end = {
                x: positions[i + 3],
                y: positions[i + 4],
                z: positions[i + 5]
            };
            lines.push({ start, end });
        }
        
        return lines;
    }

    /**
     * Calculate bounding box of all lines
     * @private
     */
    calculateBounds(lines) {
        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        
        lines.forEach(line => {
            minX = Math.min(minX, line.start.x, line.end.x);
            maxX = Math.max(maxX, line.start.x, line.end.x);
            minZ = Math.min(minZ, line.start.z, line.end.z);
            maxZ = Math.max(maxZ, line.start.z, line.end.z);
        });

        return {
            minX, maxX, minZ, maxZ,
            width: maxX - minX,
            height: maxZ - minZ
        };
    }

    /**
     * Calculate SVG dimensions maintaining aspect ratio
     * @private
     */
    calculateSVGDimensions(bounds, options) {
        const actualWidth = bounds.width;
        const actualHeight = bounds.height;
        const aspectRatio = actualWidth / actualHeight;
        const padding = Math.max(actualWidth, actualHeight) * options.padding;
        
        let svgWidth, svgHeight;
        
        if (aspectRatio > 1) {
            svgWidth = options.maxSize;
            svgHeight = options.maxSize / aspectRatio;
        } else {
            svgHeight = options.maxSize;
            svgWidth = options.maxSize * aspectRatio;
        }
        
        return {
            svgWidth,
            svgHeight,
            padding,
            aspectRatio
        };
    }

    /**
     * Project 3D lines to 2D SVG coordinates
     * @private
     */
    projectLinesToSVG(lines, bounds, dimensions, options) {
        const { svgWidth, svgHeight, padding } = dimensions;
        const { minX, minZ, width, height } = bounds;
        
        return lines.map(line => {
            // Map XZ plane to 2D (Y-axis view, Z becomes Y with flip)
            const startScreen = {
                x: ((line.start.x - minX + padding) / (width + 2 * padding)) * svgWidth,
                y: svgHeight - ((line.start.z - minZ + padding) / (height + 2 * padding)) * svgHeight
            };
            const endScreen = {
                x: ((line.end.x - minX + padding) / (width + 2 * padding)) * svgWidth,
                y: svgHeight - ((line.end.z - minZ + padding) / (height + 2 * padding)) * svgHeight
            };
            
            return { start: startScreen, end: endScreen };
        }).filter(line => 
            this.isValidPoint(line.start, svgWidth, svgHeight) && 
            this.isValidPoint(line.end, svgWidth, svgHeight)
        );
    }

    /**
     * Generate SVG content string
     * @private
     */
    generateSVG(projectedLines, dimensions, options) {
        const { svgWidth, svgHeight } = dimensions;
        const { lineWidth, lineColor, backgroundColor, precision, includeBackground } = options;
        
        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth.toFixed(0)}" height="${svgHeight.toFixed(0)}" viewBox="0 0 ${svgWidth.toFixed(0)} ${svgHeight.toFixed(0)}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .projection-line { stroke: ${lineColor}; stroke-width: ${lineWidth}; fill: none; }
      .bg { fill: ${backgroundColor}; }
    </style>
  </defs>
`;

        if (includeBackground) {
            svg += `  <rect class="bg" width="100%" height="100%"/>\n`;
        }

        svg += `  <g id="projection">\n`;

        projectedLines.forEach((line) => {
            svg += `    <line class="projection-line" x1="${line.start.x.toFixed(precision)}" y1="${line.start.y.toFixed(precision)}" x2="${line.end.x.toFixed(precision)}" y2="${line.end.y.toFixed(precision)}"/>\n`;
        });

        svg += `  </g>\n</svg>`;
        
        return svg;
    }

    /**
     * Check if point coordinates are valid
     * @private
     */
    isValidPoint(point, maxWidth, maxHeight) {
        return !isNaN(point.x) && !isNaN(point.y) && 
               isFinite(point.x) && isFinite(point.y) &&
               point.x >= 0 && point.x <= maxWidth &&
               point.y >= 0 && point.y <= maxHeight;
    }

    /**
     * Download SVG content as file
     * @private
     */
    downloadSVG(svgContent, filename) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Get projection statistics
     * @param {THREE.LineSegments} projection - Three.js LineSegments object
     * @returns {Object} Statistics object
     */
    getProjectionStats(projection) {
        if (!projection || !projection.geometry) {
            return null;
        }

        const lines = this.extractLines(projection.geometry);
        const bounds = this.calculateBounds(lines);
        
        return {
            lineCount: lines.length,
            bounds: {
                width: bounds.width,
                height: bounds.height,
                aspectRatio: bounds.width / bounds.height,
                minX: bounds.minX,
                maxX: bounds.maxX,
                minZ: bounds.minZ,
                maxZ: bounds.maxZ
            }
        };
    }
}

// Convenience functions for simple usage
export function exportProjectionToSVG(projection, filename, options) {
    const exporter = new ProjectionSVGExporter(options);
    return exporter.exportAndDownload(projection, filename);
}

export function getProjectionSVG(projection, options) {
    const exporter = new ProjectionSVGExporter(options);
    return exporter.export(projection);
}

// Default export
export default ProjectionSVGExporter;