namespace Virtex {
    export class ObjFileTypeHandler {

        static setup(viewport: Viewport, obj: any, objpath: string): void {
            const imgloader = new THREE.MTLLoader();
            imgloader.setCrossOrigin('');
            imgloader.setPath(objpath.substring(0, objpath.lastIndexOf("/")+1));
            imgloader.load(obj.materialLibraries[0],
                function(materials: any) {
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(objpath, function(object) {
                            viewport.objectGroup.add(object);
                            viewport.createCamera();
                        },
                        function(e){console.log("obj progress", e)},
                        function(e){console.log("obj error", e)}
                    );
                },
                function(e: any){console.log("mtl progress", e)},
                function(e: any){console.log("mtl error", e)}
            );
            
        }
    }
}