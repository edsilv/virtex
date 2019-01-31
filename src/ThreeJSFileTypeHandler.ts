import { Viewport } from ".";

export class ThreeJSFileTypeHandler {

    static setup(viewport: Viewport, obj: any): Promise<any> {

        return new Promise<any>((resolve) => {

            // use the three.js setting in Blender's material tab
            // if (this.options.doubleSided) {
            //     obj.traverse((child: any) => {
            //         if (child.material) child.material.side = THREE.DoubleSide;
            //     });
            // }

            viewport.objectGroup.add(obj);
            viewport.createCamera();
            resolve(obj);
            
        });
    }
}