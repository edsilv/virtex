namespace Virtex {
    export class PLYFileTypeHandler {

        static setup(viewport: Viewport, geometry: any, cb: (object: any) => void): void {
            viewport.objectGroup.add(new THREE.Mesh(geometry));
            viewport.createCamera();
            cb(geometry);
        }
    }
}