import { Viewport } from ".";

export class glTFFileTypeHandler {

    static setup(viewport: Viewport, gltf: any): Promise<any> {

        return new Promise<any>((resolve) => {
            // todo: add animation, gltf camera support e.g.
            // https://github.com/donmccurdy/three-gltf-viewer/blob/master/src/viewer.js#L183
            // allow specifying envmap? https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_gltf.html#L92
            const obj = gltf.scene || gltf.scenes[0];

            viewport.options.data.ambientLightColor = 0xffffff;
            viewport.options.data.ambientLightIntensity = 0.5;
            viewport.options.data.directionalLight1Intensity = 1;
            viewport.options.data.directionalLight2Intensity = 0;
            // https://github.com/mrdoob/three.js/pull/12766
            viewport.renderer.gammaOutput = true;
            viewport.objectGroup.add(obj);
            viewport.createLights();
            viewport.createCamera();

            resolve(gltf);
        });
    }

}