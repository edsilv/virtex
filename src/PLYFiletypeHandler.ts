namespace Virtex {
    export class PLYFileTypeHandler {

        static setup(viewport: Viewport, geometry: any): Promise<any> {

            return new Promise<any>((resolve) => {

                const material = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors } );
                material.sizeAttenuation = false;
                const mesh = new THREE.Points(geometry, material);
                viewport.objectGroup.add(mesh);
                viewport.createCamera();
                resolve(mesh);

            });
        }
    }
}