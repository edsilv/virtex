declare var Detector: any;

namespace Virtex {
    export class Viewport {
        
        private _clock: THREE.Clock;
        private _e: any;
        private _element: HTMLElement;
        private _isFullscreen: boolean = false;
        private _isMouseDown: boolean = false;
        private _isMouseOver: boolean = false;
        private _lightGroup: THREE.Group;
        private _loading: HTMLElement;
        private _loadingBar: HTMLElement;
        private _mousePos: THREE.Vector2 = new THREE.Vector2();
        private _mousePosNorm: THREE.Vector2 = new THREE.Vector2(-1, -1);
        private _mousePosOnMouseDown: THREE.Vector2 = new THREE.Vector2();
        private _oldie: HTMLElement;
        private _pinchStart: THREE.Vector2 = new THREE.Vector2();
        private _prevCameraPosition: any;
        private _prevCameraRotation: any;
        private _prevObjectPosition: any;
        private _raycaster: THREE.Raycaster;
        private _raycastObjectCache: THREE.Object3D | null = null;
        private _stats: any;
        private _targetRotation: THREE.Vector2 = new THREE.Vector2();
        private _targetRotationOnMouseDown: THREE.Vector2 = new THREE.Vector2();
        private _targetZoom: number;
        private _viewport: HTMLElement;
        private _viewportCenter: THREE.Vector2 = new THREE.Vector2();
        private _vrDisplay: any;

        public camera: THREE.PerspectiveCamera;
        public objectGroup: THREE.Group;
        public options: IVirtexOptions;
        public renderer: THREE.WebGLRenderer;
        public scene: THREE.Scene;

        constructor(options: IVirtexOptions) {
            
            this.options = options;
            this.options.data = Object.assign({}, this.data(), options.data);

            this._init();
            this.resize();
        }

        protected _init(): void {

            this._element = this.options.target;
            
            if (!this._element) {
                console.warn('target not found');
                return;
            }

            this._element.innerHTML = '';
            
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                this._oldie = <HTMLElement>document.querySelector('#oldie');
                this._element.appendChild(this._oldie);
                return;
            }

            this._viewport = document.createElement('div');
            this._viewport.classList.add('viewport');
            this._loading = document.createElement('div');
            this._loading.classList.add('loading');
            this._loadingBar = document.createElement('div');
            this._loadingBar.classList.add('bar');
            
            this._element.appendChild(this._viewport);

            this._clock = new THREE.Clock();
            this._raycaster = new THREE.Raycaster();
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(this.options.data.backgroundColor);
            this.objectGroup = new THREE.Object3D();
            this.scene.add(this.objectGroup);
            this._createLights();
            this.createCamera();
            this._createRenderer();
            this._createDOMHandlers();
            this._animate();

            this._viewport.appendChild(this._loading);
            this._loading.appendChild(this._loadingBar);
            this._loading.classList.add('beforeload');

            this._loadObject(this.options.data.file);

            // STATS //

            if (this.options.data.showStats) {
                this._stats = new Stats();
                this._stats.domElement.style.position = 'absolute';
                this._stats.domElement.style.top = '0px';
                this._viewport.appendChild(this._stats.domElement);
            }
        }
        
        public data(): IVirtexData {
            return <IVirtexData>{
                alpha: true,
                ambientLightColor: 0xd0d0d0,
                ambientLightIntensity: 1,
                antialias: true,
                cameraZ: 4.5, // multiply the width of the object by this number
                directionalLight1Color: 0xffffff,
                directionalLight1Intensity: 0.75,
                directionalLight2Color: 0x002958,
                directionalLight2Intensity: 0.5,
                doubleSided: true,
                fadeSpeed: 1750,
                far: 10000,
                file: "",
                fullscreenEnabled: true,
                maxZoom: 10,
                minZoom: 2,
                near: 0.05,
                shading: THREE.SmoothShading,
                showStats: false,
                type: FileType.OBJ,
                backgroundColor: 0x000000,
                zoomSpeed: 1
            }
        }

        private _animate(): void {
            (<any>this.renderer).animate(this._render.bind(this));
        }

        private _onPointerRestricted(): void {
            var pointerLockElement = this.renderer.domElement;
            if (pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function') {
                pointerLockElement.requestPointerLock();
            }
        }

        private _onPointerUnrestricted(): void {
            var currentPointerLockElement = document.pointerLockElement;
            var expectedPointerLockElement = this.renderer.domElement;
            if (currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function') {
                document.exitPointerLock();
            }
        }

        private _createLights(): void {
            
            this._lightGroup = new THREE.Object3D();
            this.scene.add(this._lightGroup);
            
            const light1: THREE.DirectionalLight = new THREE.DirectionalLight(this.options.data.directionalLight1Color, this.options.data.directionalLight1Intensity);
            light1.position.set(1, 1, 1);
            this._lightGroup.add(light1);

            const light2: THREE.DirectionalLight = new THREE.DirectionalLight(this.options.data.directionalLight2Color, this.options.data.directionalLight2Intensity);
            light2.position.set(-1, -1, -1);
            this._lightGroup.add(light2);

            const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(this.options.data.ambientLightColor, this.options.data.ambientLightIntensity);
            this._lightGroup.add(ambientLight);
        }

        public createCamera(): void {
            this.camera = new THREE.PerspectiveCamera(this._getFov(), this._getAspectRatio(), this.options.data.near, this.options.data.far);    
            const cameraZ: number = this._getCameraZ();
            this.camera.position.z = this._targetZoom = cameraZ;
            this.scene.add(this.camera);
        }

        private _createRenderer(): void {

            this._viewport.innerHTML = '';

            this.renderer = new THREE.WebGLRenderer({
                antialias: this.options.data.antialias,
                alpha: this.options.data.alpha
            });

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this._viewport.offsetWidth, this._viewport.offsetHeight);

            //(<any>this.renderer).vr.enabled = this._isVRMode;

            this._viewport.appendChild(this.renderer.domElement);
        }

        private _setVRDisplay(vrDisplay: any): void {
            this._vrDisplay = vrDisplay;
            (<any>this.renderer).vr.setDevice(this._vrDisplay);
            this.fire(Events.VR_AVAILABLE);
        }

        private _createDOMHandlers(): void {
            
            if ('getVRDisplays' in navigator) {

                window.addEventListener('vrdisplayconnect', (event: any) => {
                    this._setVRDisplay(event.display);
                }, false);

                window.addEventListener('vrdisplaydisconnect', () => {
                    this.fire(Events.VR_UNAVAILABLE);
                    (<any>this.renderer).vr.setDevice(null);
                }, false);

                window.addEventListener('vrdisplaypresentchange', function (event: any) {
                    console.log(event.display.isPresenting ? 'ENTER VR' : 'EXIT VR');
                }, false);

                navigator.getVRDisplays()
                    .then((displays) => {
                        if (displays.length > 0) {
                            this._setVRDisplay(displays[0]);
                        } else {
                            this.fire(Events.VR_UNAVAILABLE);
                        }
                });
            }

            window.addEventListener('vrdisplaypointerrestricted', this._onPointerRestricted.bind(this), false);
            window.addEventListener('vrdisplaypointerunrestricted', this._onPointerUnrestricted.bind(this), false);

            if (this.options.data.fullscreenEnabled) {

                document.addEventListener('webkitfullscreenchange', () => {
                    this._fullscreenChanged();
                });

                document.addEventListener('mozfullscreenchange', () => {
                    this._fullscreenChanged();
                });

                document.addEventListener('fullscreenchange', () => {
                    this._fullscreenChanged();
                });
            }
            
            this._element.addEventListener('mousedown', (e: MouseEvent) => {
                this._onMouseDown(e);
            });

            this._element.addEventListener('mousemove', (e: MouseEvent) => {
                this._onMouseMove(e);
            });

            this._element.addEventListener('mouseup', () => {
                this._onMouseUp();
            });

            this._element.addEventListener('mouseout', () => {
                this._onMouseOut();
            });

            this._element.addEventListener('mousewheel', (e: WheelEvent) => {
                this._onMouseWheel(e);
            });

            this._element.addEventListener('DOMMouseScroll', (e: MouseWheelEvent) => {
                this._onMouseWheel(e); // firefox
            });

            this._element.addEventListener('touchstart', (e: TouchEvent) => {
                this._onTouchStart(e);
            });

            this._element.addEventListener('touchmove', (e: TouchEvent) => {
                this._onTouchMove(e);
            });

            this._element.addEventListener('touchend', () => {
                this._onTouchEnd();
            });

            window.addEventListener('resize', () => {
                this.resize()
            }, false);
        }
        
        private _loadObject(objectPath: string): void {

            this._loading.classList.remove('beforeload');
            this._loading.classList.add('duringload');

            let loader: any;
            
            switch ((<FileType>this.options.data.type).toString()) {
                case FileType.DRACO.toString() :
                    loader = new (<any>THREE).DRACOLoader();
                    break;
                case FileType.CORTO.toString() :
                    loader = new (<any>THREE).CORTOLoader();
                    break;
                case FileType.GLTF.toString() :
                    loader = new (<any>THREE).GLTFLoader();
                    break;
                case FileType.OBJ.toString() :
                    loader = new THREE.OBJLoader();
                    break;
                case FileType.THREEJS.toString() :
                    loader = new THREE.ObjectLoader();
                    break;
                case FileType.PLY.toString() :
                    loader = new (<any>THREE).PLYLoader();
                    break;
            }
            
            if (loader.setCrossOrigin) {
                loader.setCrossOrigin('anonymous');
            }

            loader.load(objectPath,
                (obj: any) => {

                    switch ((<FileType>this.options.data.type).toString()) {
                        case FileType.DRACO.toString() :
                            DRACOFileTypeHandler.setup(this, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                        case FileType.CORTO.toString() :
                            CORTOFileTypeHandler.setup(this, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                        case FileType.GLTF.toString() :
                            glTFFileTypeHandler.setup(this, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                        case FileType.THREEJS.toString() :
                            ThreeJSFileTypeHandler.setup(this, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                        case FileType.OBJ.toString() :
                            ObjFileTypeHandler.setup(this, objectPath, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                        case FileType.PLY.toString() :
                            PLYFileTypeHandler.setup(this, obj).then((obj) => {
                                this._loaded(obj);
                            });
                            break;
                    }

                },
                (e: ProgressEvent) => {
                    if (e.lengthComputable) {
                        this._loadProgress(e.loaded / e.total);
                    }
                },
                (e: ErrorEvent) => {
                    // error
                    console.error(e);
                }
            );
        }

        private _loaded(obj: any): void {

            //const boundingBox = new THREE.BoxHelper(this.objectGroup, new THREE.Color(0xffffff));
            //this.scene.add(boundingBox);

            this._loading.classList.remove('duringload');
            this._loading.classList.add('afterload');
            
            this.fire(Events.LOADED, obj);
        }

        private _getBoundingBox(): THREE.Box3 {
            return new THREE.Box3().setFromObject(this.objectGroup);
        }

        private _getBoundingWidth(): number {
            return this._getBoundingBox().getSize().x;
        }

        private _getBoundingHeight(): number {
            return this._getBoundingBox().getSize().y;
        }

        // private _getDistanceToObject(): number {
        //     return this.camera.position.distanceTo(this.objectGroup.position);
        // }

        private _getCameraZ(): number {
            return this._getBoundingWidth() * <number>this.options.data.cameraZ;
        }

        private _getFov(): number {

            const width: number = this._getBoundingWidth();
            const height: number = this._getBoundingHeight(); // todo: use getSize and update definition
            const dist: number = this._getCameraZ() - width;

            //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            let fov: number = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
            //let fov: number = 2 * Math.atan((width / this._getAspectRatio()) / (2 * dist)) * (180 / Math.PI);

            return fov;
        }

        private _loadProgress(progress: number): void {
            const fullWidth: number = this._loading.offsetWidth;
            const width: number = Math.floor(fullWidth * progress);
            this._loadingBar.style.width = String(width) + "px";
        }

        private _onMouseDown(event: MouseEvent): void {
            event.preventDefault();

            this._isMouseDown = true;

            this._mousePosOnMouseDown.x = event.clientX - this._viewportCenter.x;
            this._targetRotationOnMouseDown.x = this._targetRotation.x;

            this._mousePosOnMouseDown.y = event.clientY - this._viewportCenter.y;
            this._targetRotationOnMouseDown.y = this._targetRotation.y;
        }

        private _onMouseMove(event: MouseEvent): void {

            this._mousePos.x = event.clientX - this._viewportCenter.x;
            this._mousePos.y = event.clientY - this._viewportCenter.y;

            this._mousePosNorm.x = (event.clientX / this._getWidth()) * 2 - 1;
		    this._mousePosNorm.y = - (event.clientY / this._getHeight()) * 2 + 1;

            if (this._isMouseDown) {
                this._targetRotation.y = this._targetRotationOnMouseDown.y + (this._mousePos.y - this._mousePosOnMouseDown.y) * 0.02;
                this._targetRotation.x = this._targetRotationOnMouseDown.x + (this._mousePos.x - this._mousePosOnMouseDown.x) * 0.02;
            }
        }

        private _onMouseUp(): void {
            this._isMouseDown = false;
        }

        private _onMouseOut(): void {
            this._isMouseDown = false;
        }

        private _onMouseWheel(event: MouseWheelEvent): void {

            event.preventDefault();
            event.stopPropagation();

            let delta: number = 0;

            if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
                delta = event.wheelDelta;
            } else if (event.detail !== undefined) { // Firefox
                delta = -event.detail;
            }

            if (delta > 0) {
                this.zoomIn();
            } else if (delta < 0) {
                this.zoomOut();
            }
        }

        private _onTouchStart(event: TouchEvent): void {

            const touches: TouchList = event.touches;

            if (touches.length === 1) {

                this._isMouseDown = true;

                event.preventDefault();

                this._mousePosOnMouseDown.x = touches[0].pageX - this._viewportCenter.x;
                this._targetRotationOnMouseDown.x = this._targetRotation.x;

                this._mousePosOnMouseDown.y = touches[0].pageY - this._viewportCenter.y;
                this._targetRotationOnMouseDown.y = this._targetRotation.y;
            }
        }

        private _onTouchMove(event: TouchEvent): void {

            event.preventDefault();
            event.stopPropagation();

            const touches: TouchList = event.touches;

            switch (touches.length) {

                case 1: // one-fingered touch: rotate
                    event.preventDefault();

                    this._mousePos.x = touches[0].pageX - this._viewportCenter.x;
                    this._targetRotation.x = this._targetRotationOnMouseDown.x + (this._mousePos.x - this._mousePosOnMouseDown.x) * 0.05;

                    this._mousePos.y = touches[0].pageY - this._viewportCenter.y;
                    this._targetRotation.y = this._targetRotationOnMouseDown.y + (this._mousePos.y - this._mousePosOnMouseDown.y) * 0.05;

                    break;

                case 2: // two-fingered touch: zoom
                    const dx: number = touches[0].pageX - touches[1].pageX;
                    const dy: number = touches[0].pageY - touches[1].pageY;
                    const distance: number = Math.sqrt(dx * dx + dy * dy);

                    const pinchEnd: THREE.Vector2 = new THREE.Vector2(0, distance);
                    const pinchDelta: THREE.Vector2 = new THREE.Vector2();
                    pinchDelta.subVectors(pinchEnd, this._pinchStart);

                    if (pinchDelta.y > 0) {
                        this.zoomIn();
                    } else if (pinchDelta.y < 0) {
                        this.zoomOut();
                    }

                    this._pinchStart.copy(pinchEnd);

                    break;

                case 3: // three-fingered touch: pan

                    //var panEnd = new THREE.Vector2();
                    //panEnd.set(touches[0].pageX, touches[0].pageY);
                    //var panDelta = new THREE.Vector2();
                    //panDelta.subVectors(panEnd, panStart);
                    //
                    //panCamera(panDelta.x, panDelta.y);
                    //
                    //panStart.copy(panEnd);

                    break;
            }
        }

        private _onTouchEnd(): void {
            this._isMouseDown = false;
        }

        public rotateY(radians: number): void {
            const rotation: number = this.objectGroup.rotation.y + radians;
            this.objectGroup.rotation.y = rotation;
        }
        
        // private _applyTransform(): void{
        //     this.objectGroup.updateMatrix();

        //     //this.objectGroup.geometry.applyMatrix( this.objectGroup.matrix );

        //     this.objectGroup.position.set( 0, 0, 0 );
        //     this.objectGroup.rotation.set( 0, 0, 0 );
        //     this.objectGroup.scale.set( 1, 1, 1 );
        //     this.objectGroup.updateMatrix();
        // }

        private _render(): void {
            
            //const delta: number = this._clock.getDelta() * 60;

            // horizontal rotation
            this.rotateY((this._targetRotation.x - this.objectGroup.rotation.y) * 0.1);

            // vertical rotation
            const finalRotationY: number = (this._targetRotation.y - this.objectGroup.rotation.x);

            if (this.objectGroup.rotation.x <= 1 && this.objectGroup.rotation.x >= -1) {
                this.objectGroup.rotation.x += finalRotationY * 0.1;
            }

            // limit vertical rotation 
            if (this.objectGroup.rotation.x > 1) {
                this.objectGroup.rotation.x = 1
            } else if (this.objectGroup.rotation.x < -1) {
                this.objectGroup.rotation.x = -1
            }

            const zoomDelta: number = (this._targetZoom - this.camera.position.z) * 0.1;
            this.camera.position.z += zoomDelta;

            // cast a ray from the mouse position

            if (this.objectGroup.children.length) {
                
                this._raycaster.setFromCamera(this._mousePosNorm, this.camera);

                const obj: THREE.Object3D | null = this._getRaycastObject();

                if (obj) {

                    const intersects: THREE.Intersection[] = this._raycaster.intersectObject(obj);

                    if (intersects.length > 0) {
                        this._isMouseOver = true;
                        // var obj2 = intersects[0].object;
                        // (<any>obj2).material.emissive.setHex( 0xff0000 );
                        // console.log("hit");
                    } else {
                        this._isMouseOver = false;
                    }

                }
            }

            if (this._isMouseOver) {
                this._element.classList.add('grabbable');
                if (this._isMouseDown) {
                    this._element.classList.add('grabbing');
                } else {
                    this._element.classList.remove('grabbing');
                }
            } else {
                this._element.classList.remove('grabbable');
                this._element.classList.remove('grabbing');
            }

            this.renderer.render(this.scene, this.camera);
        }

        private _getRaycastObject(): THREE.Object3D | null {

            if (this._raycastObjectCache) {
                return this._raycastObjectCache;
            }

            this.objectGroup.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                    this._raycastObjectCache = child;
                }
            });

            return this._raycastObjectCache;
        }

        private _getWidth(): number {
            if (this._isFullscreen) {
                return window.innerWidth;
            }
            return this._element.offsetWidth;
        }

        private _getHeight(): number {
            if (this._isFullscreen) {
                return window.innerHeight;
            }
            return this._element.offsetHeight;
        }

        private _getZoomSpeed(): number {
            return this._getBoundingWidth() * <number>this.options.data.zoomSpeed;
        }

        private _getMaxZoom(): number {
            return this._getBoundingWidth() * <number>this.options.data.maxZoom;
        }

        private _getMinZoom(): number {
            return this._getBoundingWidth() * <number>this.options.data.minZoom;
        }

        public zoomIn(): void {
            const targetZoom: number = this.camera.position.z - this._getZoomSpeed();
            if (targetZoom > this._getMinZoom()) {
                this._targetZoom = targetZoom;
            } else {
                this._targetZoom = this._getMinZoom();
            }
        }

        public zoomOut(): void {
            const targetZoom: number = this.camera.position.z + this._getZoomSpeed();
            if (targetZoom < this._getMaxZoom()) {
                this._targetZoom = targetZoom;
            } else {
                this._targetZoom = this._getMaxZoom();
            }
        }
        
        public enterVR(): void {
            this._vrDisplay.requestPresent([{ source: this.renderer.domElement }]);     
            (<any>this.renderer).vr.enabled = true;
            this._prevCameraPosition = this.camera.position.clone();
            this._prevCameraRotation = this.camera.rotation.clone();
            this._prevObjectPosition = this.objectGroup.position.clone();

            this.objectGroup.position.z -= this._getBoundingWidth();
        }
        
        public exitVR(): void {
            this._vrDisplay.exitPresent();      
            (<any>this.renderer).vr.enabled = false;
            this.camera.position.copy(this._prevCameraPosition);
            this.camera.rotation.copy(this._prevCameraRotation);
            this.objectGroup.position.copy(this._prevObjectPosition);
        }

        public toggleVR(): void {

            if (!this._vrDisplay) {
                return;
            }

            if (this._vrDisplay.isPresenting) {
                this.exitVR();
            } else {
                this.enterVR();
            }
        }
        
        private _getAspectRatio(): number {
            // if (this._isFullscreen) {
            //     return window.innerWidth / window.innerHeight;
            // } else {
                return this._viewport.offsetWidth / this._viewport.offsetHeight;
            //}
        }

        public on(name: string, callback: Function, ctx: any): void {
            var e = this._e || (this._e = {});

            (e[name] || (e[name] = [])).push({
                fn: callback,
                ctx: ctx
            });
        }

        public fire(name: string, ...args: any[]): void {
            var data = [].slice.call(args, 1);
            var evtArr = ((this._e || (this._e = {}))[name] || []).slice();
            var i = 0;
            var len = evtArr.length;

            for (i; i < len; i++) {
                evtArr[i].fn.apply(evtArr[i].ctx, data);
            }
        }

        public enterFullscreen(): void {            
            if (!this.options.data.fullscreenEnabled) return;            
            const elem: HTMLElement = this._viewport;
            const requestFullScreen: any = this._getRequestFullScreen(elem);

            if (requestFullScreen) {
                requestFullScreen.call(elem);
            }
        }
        
        public exitFullscreen(): void {
            const exitFullScreen: any = this._getExitFullScreen();

            if (exitFullScreen) {
                exitFullScreen.call(document);
            }
        }
        
        private _getRequestFullScreen(elem: any): any {

            if (elem.requestFullscreen) {
                return elem.requestFullscreen;
            } else if (elem.msRequestFullscreen) {
                return elem.msRequestFullscreen;
            } else if (elem.mozRequestFullScreen) {
                return elem.mozRequestFullScreen;
            } else if (elem.webkitRequestFullscreen) {
                return elem.webkitRequestFullscreen;
            }
            return false;
        }

        private _getExitFullScreen(): any {

            if (document.exitFullscreen) {
                return document.exitFullscreen;
            } else if (document.msExitFullscreen) {
                return document.msExitFullscreen;
            } else if (document.mozCancelFullScreen) {
                return document.mozCancelFullScreen;
            } else if (document.webkitExitFullscreen) {
                return document.webkitExitFullscreen;
            }
            return false;
        }

        private _fullscreenChanged(): void {
            this._isFullscreen = !this._isFullscreen; 
            this.resize();
        }

        public resize(): void {

            if (this._element && this._viewport) {
                
                const width: string = this._getWidth() + "px";
                const height: string = this._getHeight() + "px";

                this._viewport.style.width = width;
                this._viewport.style.height = height;

                this._viewportCenter.x = this._viewport.offsetWidth / 2;
                this._viewportCenter.y = this._viewport.offsetHeight / 2;

                this.camera.aspect = this._getAspectRatio();
                this.camera.updateProjectionMatrix();
                
                this.renderer.setSize(this._viewport.offsetWidth, this._viewport.offsetHeight);

                this._loading.style.left = String((this._viewportCenter.x) - (this._loading.offsetWidth / 2)) + "px";
                this._loading.style.top = String((this._viewportCenter.y) - (this._loading.offsetHeight / 2)) + "px";
                
            } else if (this._oldie) {
                this._oldie.style.left = String((this._element.offsetWidth / 2) - (this._oldie.offsetWidth / 2)) + "px";
                this._oldie.style.top = String((this._element.offsetHeight / 2) - (this._oldie.offsetHeight / 2)) + "px";
            }
        }
    }

    export class Events {
        static LOADED: string = 'loaded';
        static VR_AVAILABLE: string = 'vravailable';
        static VR_UNAVAILABLE: string = 'vrunavailable';
    }
}

(function(g: any) {
    if (!g.Virtex) {
        g.Virtex = Virtex;
    }
})(global);
