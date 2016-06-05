var metadata = require('./package');

var GulpConfig = (function () {
    function GulpConfig() {
        this.name = 'virtex';
        // libs that MUST be included in a consuming app for this component to work
        this.deps = [
            'node_modules/base-component/dist/base-component.js',
            'node_modules/three/three.min.js',
            'node_modules/three/examples/js/controls/VRControls.js',
            'node_modules/three/examples/js/effects/VREffect.js',
            'node_modules/three/examples/js/libs/stats.min.js',
            'node_modules/three/examples/js/Detector.js',
            'node_modules/webvr-polyfill/build/webvr-polyfill.js',
            'node_modules/key-codes/dist/key-codes.js'
        ];
        // libs that MAY be included in a consuming app but are used here for testing purposes
        this.testDeps = [
            
        ];
        this.testDepsDir = './test/js';
        // ts definitions to copy to the typings dir
        this.typings = [
            'node_modules/base-component/dist/base-component.d.ts',
            'node_modules/key-codes/dist/key-codes.d.ts'
        ];
        this.typingsDir = './typings';
        this.dist = './dist';
        this.header = '// ' + this.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
        this.jsOut = this.name + '.js';
        this.jsBundleOut = this.name + '.bundle.js';
        this.jsMinOut = this.name + '.min.js';
        this.dtsOut = this.name + '.d.ts';
        this.dtsBundleOut = this.name + '.bundle.d.ts';
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
        this.cssSrc = 'src/*.css';
        this.testCSSDir = './test/css';
    }
    return GulpConfig;
})();

module.exports = GulpConfig;