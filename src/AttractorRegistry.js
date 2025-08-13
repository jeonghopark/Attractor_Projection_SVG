import * as THREE from "three";

export const ATTRACTORS = {
    aizawa: {
        label: "Aizawa",
        defaults: {
            a: 0.95,
            b: 0.7,
            c: 0.6,
            d: 3.5,
            e: 0.25,
            f: 0.6,
            speed: 0.75,
            start: [1, -1, 1],
        },
        ranges: {
            a: [0.85, 1.0],
            b: [0.6, 0.7],
            c: [0.5, 0.7],
            d: [3.4, 3.6],
            e: [0.2, 1],
            f: [0.5, 0.7],
            speed: [0.2, 2],
            startX: [-2, 2],
            startY: [-2, 2],
            startZ: [-2, 2],
        },
        numeric: {
            dt: 0.0015,
            oversample: 10,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 4.4,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * ((z - p.b) * x - p.d * y);
            const ny = p.speed * (p.d * x + (z - p.b) * y);
            const nz =
                p.speed *
                (p.c +
                    p.a * z -
                    (z * z * z) / 3 -
                    (x * x + y * y) * (1 + p.e * z) +
                    p.f * z * x * x * x);
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    thomas: {
        label: "Thomas",
        defaults: {
            b: 0.208186,
            speed: 0.2,
            start: [1, 0, 1],
        },
        ranges: {
            b: [0.15, 0.3],
            speed: [0.1, 0.2],
            startX: [-2, 2],
            startY: [-2, 2],
            startZ: [-2, 2],
        },
        numeric: {
            dt: 0.1,
            oversample: 10,
            numPoints: 3000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 2.4,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * (Math.sin(y) - p.b * x);
            const ny = p.speed * (Math.sin(z) - p.b * y);
            const nz = p.speed * (Math.sin(x) - p.b * z);
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    lorenz: {
        label: "Lorenz",
        defaults: {
            sigma: 10,
            rho: 28,
            beta: 8 / 3,
            speed: 0.2,
            start: [1, -1, 1],
        },
        ranges: {
            sigma: [5, 15],
            rho: [20, 35],
            beta: [2, 3],
            speed: [0.5, 2],
            startX: [-2, 2],
            startY: [-2, 2],
            startZ: [-2, 2],
        },
        numeric: {
            dt: 0.001,
            oversample: 12,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 0.4,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * (p.sigma * (y - x));
            const ny = p.speed * (x * (p.rho - z) - y);
            const nz = p.speed * (x * y - p.beta * z);
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    chen: {
        label: "Chen",
        defaults: {
            alpha: 5.0,
            beta: -10.0,
            delta: -0.83,
            speed: 1.0,
            start: [5, -10, 10],
        },
        ranges: {
            alpha: [4, 6],
            beta: [-11, -9],
            delta: [-0.93, -0.73],
            speed: [0.9, 1.1],
            startX: [-2, 2],
            startY: [-2, 2],
            startZ: [-2, 2],
        },
        numeric: {
            dt: 0.001,
            oversample: 12,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 0.4,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * (p.alpha * x - y * z);
            const ny = p.speed * (p.beta * y + x * z);
            const nz = p.speed * (p.delta * z + (x * y) / 3);
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    dadras: {
        label: "Dadras",
        defaults: {
            a: 3.0,
            b: 2.7,
            c: 1.7,
            d: 2.0,
            e: 9.0,
            speed: 1.0,
            start: [1.1, -2.1, -2.0],
        },
        ranges: {
            a: [2, 4],
            b: [1.7, 3.7],
            c: [0.7, 2.7],
            d: [1.0, 3.0],
            e: [8.0, 10.0],
            speed: [0.9, 1.1],
        },
        numeric: {
            dt: 0.001,
            oversample: 12,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 0.7,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * (y - p.a * x + p.b * y * z);
            const ny = p.speed * (p.c * y - x * z + z);
            const nz = p.speed * (p.d * x * y - p.e * z);
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    rossler: {
        label: "Rossler",
        defaults: {
            a: 0.2,
            b: 0.2,
            c: 5.7,
            speed: 1.0,
            start: [10, 0, 10],
        },
        ranges: {
            a: [0.01, 0.3],
            b: [0.01, 0.3],
            c: [4.7, 6.7],
            speed: [0.9, 1.1],
        },
        numeric: {
            dt: 0.01,
            oversample: 12,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 0.7,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * -(y + z);
            const ny = p.speed * (x + p.a * y);
            const nz = p.speed * (p.b + z * (x - p.c));
            return new THREE.Vector3(nx, ny, nz);
        },
    },

    sprott: {
        label: "Sprott",
        defaults: {
            a: 2.07,
            b: 1.79,
            speed: 1.0,
            start: [0.63, 0.47, -0.54],
        },
        ranges: {
            a: [1.07, 3.07],
            b: [0.79, 2.79],
            speed: [0.9, 1.1],
        },
        numeric: {
            dt: 0.01,
            oversample: 12,
            numPoints: 2000,
            // maxPoints: 1000,
            maxPointsRatio: 0.5,
            size: 6.7,
        },
        component: (x, y, z, p) => {
            const nx = p.speed * (y + p.a * x * y + x * z);
            const ny = p.speed * (1 - p.b * x * x + y * z);
            const nz = p.speed * (x - x * x - y * y);
            return new THREE.Vector3(nx, ny, nz);
        },
    },
};