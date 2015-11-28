module.exports = <IVirtex>{
    create: function(options: Virtex.IOptions): Virtex.Viewport {
        return new Virtex.Viewport(options);
    }
};