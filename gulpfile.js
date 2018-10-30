const gulp = require('gulp');
const metadata = require('./package');
const tasks = require('gulp-tasks');

metadata.name = 'virtex';

tasks.init({
    metadata: metadata,
    libs: [
        'node_modules/three/build/three.min.js',
        'node_modules/three/examples/js/libs/stats.min.js',
        'node_modules/three/examples/js/loaders/draco_decoder.js',
        'node_modules/three/examples/js/loaders/DRACOLoader.js',
        'node_modules/three/examples/js/loaders/GLTFLoader.js',
        'node_modules/three/examples/js/loaders/MTLLoader.js',
        'node_modules/three/examples/js/loaders/OBJLoader.js',
        'node_modules/three/examples/js/loaders/PLYLoader.js',
        'node_modules/three/examples/js/Detector.js',
        'node_modules/three/examples/js/vr/WebVR.js',
        'node_modules/@edsilv/key-codes/dist/KeyCodes.js'
    ]
});