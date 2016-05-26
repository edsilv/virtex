var metadata = require('./package');

var GulpConfig = (function () {
    function GulpConfig() {
        this.name = 'virtex';
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
    }
    return GulpConfig;
})();

module.exports = GulpConfig;