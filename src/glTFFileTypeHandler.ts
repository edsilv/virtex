namespace Virtex {
    export class glTFFileTypeHandler {

        static setup(viewport: Viewport, gltf: any): Promise<any> {

            return new Promise<any>((resolve) => {

                //https://github.com/donmccurdy/three-gltf-viewer/blob/master/src/viewer.js#L183
                const scene = gltf.scene || gltf.scenes[0];
                const clips = gltf.animations || [];
                //glTFFileTypeHandler.setContent(scene, clips);

                viewport.objectGroup.add(scene);

                // if (obj.animations) {
                //     const animations = obj.animations;

                //     for (var i = 0, l = animations.length; i < l; i++) {
                //         //const animation = animations[i];
                //         //animation.loop = true;
                //         //animation.play();
                //     }
                // }

                viewport.scene = gltf.scene;

                if (gltf.cameras && gltf.cameras.length) {
                    viewport.camera = gltf.cameras[0];
                }

                resolve(gltf);
            });
        }

        static setContent(object: any, clips: any) {

            //this.clear();

            object.updateMatrixWorld();
            const box = new THREE.Box3().setFromObject(object);
            //const size = box.getSize().length();
            const center = box.getCenter();

            //this.controls.reset();

            object.position.x += (object.position.x - center.x);
            object.position.y += (object.position.y - center.y);
            object.position.z += (object.position.z - center.z);
            // this.controls.maxDistance = size * 10;
            // this.defaultCamera.near = size / 100;
            // this.defaultCamera.far = size * 100;
            // this.defaultCamera.updateProjectionMatrix();

            // if (this.options.cameraPosition) {

            //     this.defaultCamera.position.fromArray(this.options.cameraPosition);
            //     this.defaultCamera.lookAt(new THREE.Vector3());

            // } else {

            //     this.defaultCamera.position.copy(center);
            //     this.defaultCamera.position.x += size / 2.0;
            //     this.defaultCamera.position.y += size / 5.0;
            //     this.defaultCamera.position.z += size / 2.0;
            //     this.defaultCamera.lookAt(center);

            // }

            // this.setCamera(DEFAULT_CAMERA);

            //this.controls.saveState();

            //this.scene.add(object);
            // this.content = object;

            // this.state.addLights = true;
            // this.content.traverse((node) => {
            //     if (node.isLight) {
            //         this.state.addLights = false;
            //     }
            // });

            // this.setClips(clips);

            // this.updateLights();
            // this.updateGUI();
            // this.updateEnvironment();
            // this.updateTextureEncoding();
            // this.updateDisplay();

            // window.content = this.content;
            // console.info('[glTF Viewer] THREE.Scene exported as `window.content`.');
            // this.printGraph(this.content);

        }
    }
}

