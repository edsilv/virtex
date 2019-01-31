import { Viewport } from ".";

export class ObjFileTypeHandler {

    static setup(viewport: Viewport, objpath: string, obj: any): Promise<any> {
        
        return new Promise<any>((resolve) => {

            const imgloader = new THREE.MTLLoader();
            imgloader.setCrossOrigin(true);
            imgloader.setPath(objpath.substring(0, objpath.lastIndexOf("/") + 1));
            imgloader.load(obj.materialLibraries[0],
                function(materials: any) {
                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(objpath, function(obj: any) {

                            // Compute range of the geometry coordinates for proper rendering.
                            const bufferGeometry = (<any>obj.children[0]).geometry;
                            bufferGeometry.computeBoundingBox();
                            const sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
                            const sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
                            const sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
                            const diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
                            const scale = 1.0 / diagonalSize;
                            const midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
                            const midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
                            const midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;

                            obj.scale.multiplyScalar(scale);
                            obj.position.x = -midX * scale;
                            obj.position.y = -midY * scale;
                            obj.position.z = -midZ * scale;
                            obj.castShadow = true;
                            obj.receiveShadow = true;

                            viewport.objectGroup.add(obj);
                            viewport.createCamera();

                            resolve(obj);
                        },
                        function() {
                            //console.log("obj progress", e);
                        },
                        function() {
                            //console.log("obj error", e);
                        }
                    );
                },
                function() {
                    //console.log("mtl progress", e);
                },
                function() {
                    //console.log("mtl error", e);
                }
            );
        });            
    }
}