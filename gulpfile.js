const gulp = require('gulp');
const metadata = require('./package');
const tasks = require('gulp-tasks');

metadata.name = 'virtex';

tasks.init({
    metadata: metadata,
    // libs that MUST be included in a consuming app for this component to work
    libs: [
        'node_modules/base-component/dist/base-component.js',
        'node_modules/three/build/three.min.js',
        'node_modules/three/examples/js/controls/VRControls.js',
        'node_modules/three/examples/js/effects/VREffect.js',
        'node_modules/three/examples/js/libs/stats.min.js',
        'node_modules/three/examples/js/loaders/draco_decoder.js',
        'node_modules/three/examples/js/loaders/DRACOLoader.js',
        'node_modules/three/examples/js/loaders/GLTFLoader.js',
        'node_modules/three/examples/js/loaders/MTLLoader.js',
        'node_modules/three/examples/js/loaders/OBJLoader.js',
        'node_modules/three/examples/js/loaders/PLYLoader.js',
        'node_modules/three/examples/js/Detector.js',
        'node_modules/three/examples/js/vr/WebVR.js',
        'node_modules/key-codes/dist/key-codes.js'
    ],
    // libs that MAY be included in a consuming app but are used here for example purposes
    examples: []
});

// removed corto due to GPL license
// 'node_modules/corto/js/corto.js',
// 'node_modules/corto/js/CORTOLoader.js',
