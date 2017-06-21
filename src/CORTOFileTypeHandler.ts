namespace Virtex {
    export class CORTOFileTypeHandler {

        static setup(viewport: Viewport, obj: any): void {
            const bufferGeometry = obj.geometry;
/*            const material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors});
            let geometry;
            // Point cloud does not have face indices.
            if (bufferGeometry.index == null) {
                geometry = new THREE.Points(bufferGeometry, material);
            } else {
                bufferGeometry.computeVertexNormals();
                geometry = new THREE.Mesh(bufferGeometry, material);
            } 
*/
            // Compute range of the geometry coordinates for proper rendering.
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

//            obj = geometry;

            viewport.objectGroup.add(obj);

            viewport.createCamera();
        }
    }
}

