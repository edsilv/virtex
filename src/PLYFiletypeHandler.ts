namespace Virtex {
    export class PLYFileTypeHandler {

        static setup(viewport: Viewport, geometry: any, cb: (object: any) => void): void {
            var material = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors } );
            var mesh = new THREE.Points(geometry, material);
            viewport.objectGroup.add(mesh);
            viewport.createCamera();
            cb(mesh);
        }
    }
}