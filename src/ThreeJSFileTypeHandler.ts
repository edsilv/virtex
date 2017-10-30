namespace Virtex {
    export class ThreeJSFileTypeHandler {

        static setup(viewport: Viewport, obj: any, cb: (object: any) => void): void {

            // use the three.js setting in Blender's material tab
            // if (this.options.doubleSided) {
            //     obj.traverse((child: any) => {
            //         if (child.material) child.material.side = THREE.DoubleSide;
            //     });
            // }

            viewport.objectGroup.add(obj);
            viewport.createCamera();
            cb(obj);
        }
    }
}