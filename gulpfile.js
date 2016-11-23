const gulp = require('gulp');
const metadata = require('./package');
const tasks = require('gulp-tasks');

metadata.name = 'virtex';

tasks.init({
    metadata: metadata,
    // libs that MUST be included in a consuming app for this component to work
    libs: [
        'node_modules/base-component/dist/base-component.bundle.js',
        'node_modules/three/build/three.min.js',
        'node_modules/three/examples/js/controls/VRControls.js',
        'node_modules/three/examples/js/effects/VREffect.js',
        'node_modules/three/examples/js/libs/stats.min.js',
        'node_modules/three/examples/js/loaders/GLTFLoader.js',
        'node_modules/three/examples/js/Detector.js',
        'node_modules/three/examples/js/WebVR.js',
        'node_modules/key-codes/dist/key-codes.js'
    ],
    // libs that MAY be included in a consuming app but are used here for example purposes
    examples: [],
    // ts definitions to copy to the 'typings' dir
    typings: [
        'node_modules/base-component/dist/base-component.d.ts',
        'node_modules/key-codes/dist/key-codes.d.ts',
        'node_modules/base-component/typings/corejs.d.ts',
        'node_modules/base-component/typings/jquery.d.ts',
        'node_modules/base-component/typings/node.d.ts'
    ]
});