namespace Virtex {
    export class glTFFileTypeHandler {

        static setup(viewport: Viewport, obj: any): void {

            viewport.objectGroup.add(obj.scene);

            if (obj.animations) {
                const animations = obj.animations;

                for (var i = 0, l = animations.length; i < l; i++) {
                    //const animation = animations[i];
                    //animation.loop = true;
                    //animation.play();
                }
            }

            viewport.scene = obj.scene;

            if (obj.cameras && obj.cameras.length) {
                viewport.camera = obj.cameras[0];
            }
        }
    }
}

