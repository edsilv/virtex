var metadata = require('./package');

var GulpConfig = (function () {
    function GulpConfig() {
        this.lib = 'virtex';
        this.dist = './dist';
        this.header = '// ' + metadata.name + ' v' + metadata.version + ' ' + metadata.homepage + '\n';
        this.jsOut = this.lib + '.js';
        this.dtsOut = this.lib + '.d.ts';
        this.tsSrc = [
            'src/_references.ts',
            'src/*.ts',
            'typings/*.ts'];
    }
    return GulpConfig;
})();

module.exports = GulpConfig;