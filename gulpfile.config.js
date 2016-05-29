var metadata = require('./package');

var GulpConfig = (function () {
    function GulpConfig() {
        this.name = 'virtex';
        this.deps = [
            'node_modules/three/three.min.js',
            'node_modules/three/examples/js/controls/VRControls.js',
            'node_modules/three/examples/js/effects/VREffect.js',
            'node_modules/three/examples/js/libs/stats.min.js',
            'node_modules/three/examples/js/Detector.js',
            'node_modules/webvr-polyfill/build/webvr-polyfill.js',
            'node_modules/key-codes/dist/key-codes.js'
        ];
        this.testDeps = [];
        this.testDepsDir = './test/js';
        this.typings = [
            'node_modules/key-codes/dist/key-codes.d.ts'
        ];
        this.typingsDir = './typings';
        this.dist = './dist';
        this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
        this.jsOut = this.name + '.js';
        this.dtsOut = this.name + '.d.ts';
        this.tsSrc = [
            'src/_references.ts',
            'src/*.ts',
            'typings/*.ts'];
        this.tsConfig = {
            declarationFiles: true,
            noExternalResolve: true,
            noLib: false,
            module: 'commonjs',
            sortOutput: true
        };
        this.browserifyConfig = {
            standalone: this.name,
            debug: false
        };
        this.browserifySrc = this.dist;
        this.browserifyTarget = this.dist;
    }
    return GulpConfig;
})();

module.exports = GulpConfig;