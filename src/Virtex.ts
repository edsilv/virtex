
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        (<any>window).msRequestAnimationFrame ||
        function (callback: Function) {
            window.setTimeout(callback, 1000 / 200);
        };
})();

declare var Detector: any;

namespace Virtex {
    export class Viewport {
        
        private _$element: HTMLElement;
        public options: IVirtexOptions;
        
        private _e: any;
        private _$viewport: HTMLElement;
        private _$loading: HTMLElement;
        private _$loadingBar: HTMLElement;
        private _$oldie: HTMLElement;

        private _lightGroup: THREE.Group;
        private _prevCameraPosition: any;
        private _prevCameraRotation: any;
        private _raycaster: THREE.Raycaster;
        private _raycastObjectCache: THREE.Object3D | null = null;
        private _renderer: THREE.WebGLRenderer;
        private _stats: any;
        private _viewportCenter: THREE.Vector2 = new THREE.Vector2();
        public camera: THREE.PerspectiveCamera;
        public objectGroup: THREE.Group;
        public scene: THREE.Scene;

        private _isFullscreen: boolean = false;
        private _isMouseDown: boolean = false;
        private _isVRMode: boolean = false;
        private _lastHeight: number;
        private _lastWidth: number;
        private _isMouseOver: boolean = false;
        private _mousePos: THREE.Vector2 = new THREE.Vector2();
        private _mousePosNorm: THREE.Vector2 = new THREE.Vector2(-1, -1);
        private _mousePosOnMouseDown: THREE.Vector2 = new THREE.Vector2();
        private _pinchStart: THREE.Vector2 = new THREE.Vector2();
        private _targetRotationOnMouseDown: THREE.Vector2 = new THREE.Vector2();
        private _targetRotation: THREE.Vector2 = new THREE.Vector2();
        private _targetZoom: number;
        private _vrControls: THREE.VRControls;
        private _vrEffect: THREE.VREffect;
        private _vrEnabled: boolean = true;

        constructor(options: IVirtexOptions) {
            
            this.options = options;
            this.options.data = Object.assign({}, this.data(), options.data);

            const success: boolean = this._init();

            this._resize();

            if (success) {
                this._tick();
            }
        }

        protected _init(): boolean {

            this._$element = this.options.target;
            
            if (!this._$element) {
                console.warn('target not found');
                return false;
            }

            this._$element.innerHTML = '';
            
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                this._$oldie = <HTMLElement>document.querySelector('#oldie');
                this._$element.appendChild(this._$oldie);
                return false;
            }

            this._$viewport = document.createElement('div');
            this._$viewport.classList.add('viewport');
            this._$loading = document.createElement('div');
            this._$loading.classList.add('loading');
            this._$loadingBar = document.createElement('div');
            this._$loadingBar.classList.add('bar');
            
            this._$element.appendChild(this._$viewport);

            this.scene = new THREE.Scene();
            this.objectGroup = new THREE.Object3D();
            this.scene.add(this.objectGroup);

            this._raycaster = new THREE.Raycaster();

            this._createLights();
            this.createCamera();
            this._createControls();
            this._createRenderer();
            this._createEventListeners();

            this._$viewport.appendChild(this._$loading);
            this._$loading.appendChild(this._$loadingBar);
            this._$loading.style.visibility = "hidden";

            this._loadObject(this.options.data.file);
            
            // STATS //

            if (this.options.data.showStats) {
                this._stats = new Stats();
                this._stats.domElement.style.position = 'absolute';
                this._stats.domElement.style.top = '0px';
                this._$viewport.appendChild(this._stats.domElement);
            }

            return true;
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
                type: FileType.THREEJS,
                vrBackgroundColor: 0x000000,
                zoomSpeed: 1
            }
        }
        
        private _getVRDisplay(): Promise<VRDisplay> {
            return new Promise((resolve) => {
                navigator.getVRDisplays().then((devices) => {
                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i] instanceof VRDisplay) {
                            resolve(devices[i]);
                            break;
                        }
                    }
                    resolve(undefined);
                }, () => {
                    // No devices found
                    resolve(undefined);
                });
            });
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
        }

        private _createRenderer(): void {

            this._renderer = new THREE.WebGLRenderer({
                antialias: this.options.data.antialias,
                alpha: this.options.data.alpha
            });

            if (this._isVRMode) {
                this._renderer.setClearColor(this.options.data.vrBackgroundColor);
                this._vrEffect = new THREE.VREffect(this._renderer);
                this._vrEffect.setSize(this._$viewport.offsetWidth, this._$viewport.offsetHeight);
            } else {
                this._renderer.setClearColor(this.options.data.vrBackgroundColor, 0);
                this._renderer.setSize(this._$viewport.offsetWidth, this._$viewport.offsetHeight);
            }

            this._$viewport.innerHTML = '';
            this._$viewport.appendChild(this._renderer.domElement);
        }
        
        private _createControls(): void {

            if (this._isVRMode) {
                // Apply VR headset positional data to camera.
                this._vrControls = new THREE.VRControls(this.camera);                
            }
        }

        private _createEventListeners(): void {
            
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
            
            this._$element.addEventListener('mousedown', (e: MouseEvent) => {
                this._onMouseDown(e);
            });

            this._$element.addEventListener('mousemove', (e: MouseEvent) => {
                this._onMouseMove(e);
            });

            this._$element.addEventListener('mouseup', () => {
                this._onMouseUp();
            });

            this._$element.addEventListener('mouseout', () => {
                this._onMouseOut();
            });

            this._$element.addEventListener('mousewheel', (e: WheelEvent) => {
                this._onMouseWheel(e);
            });

            this._$element.addEventListener('DOMMouseScroll', (e: MouseWheelEvent) => {
                this._onMouseWheel(e); // firefox
            });

            this._$element.addEventListener('touchstart', (e: TouchEvent) => {
                this._onTouchStart(e);
            });

            this._$element.addEventListener('touchmove', (e: TouchEvent) => {
                this._onTouchMove(e);
            });

            this._$element.addEventListener('touchend', () => {
                this._onTouchEnd();
            });

            window.addEventListener('resize', () => this._resize(), false);
        }
        
        private _loadObject(objectPath: string): void {
            this._$loading.style.visibility = "visible";

            let loader: any;
            
            switch (this.options.data.type.toString()) {
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

                    switch (this.options.data.type.toString()) {
                        case FileType.DRACO.toString() :
                            DRACOFileTypeHandler.setup(this, obj, this._loaded.bind(this));
                            break;
                        case FileType.CORTO.toString() :
                            CORTOFileTypeHandler.setup(this, obj, this._loaded.bind(this));
                            break;
                        case FileType.GLTF.toString() :
                            glTFFileTypeHandler.setup(this, obj, this._loaded.bind(this));
                            break;
                        case FileType.THREEJS.toString() :
                            ThreeJSFileTypeHandler.setup(this, obj, this._loaded.bind(this));
                            break;
                        case FileType.OBJ.toString() :
                            ObjFileTypeHandler.setup(this, objectPath, obj, this._loaded.bind(this));
                            break;
                        case FileType.PLY.toString() :
                            PLYFileTypeHandler.setup(this, obj, this._loaded.bind(this));
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

            // todo: add fading
            //this._$loading.fadeOut(this.options.data.fadeSpeed);
            this._$loading.style.visibility = "hidden";
            
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
            return this._getBoundingWidth() * this.options.data.cameraZ;
        }

        private _getFov(): number {

            if (!this.camera) return 1;

            const width: number = this._getBoundingWidth();
            const height: number = this._getBoundingHeight(); // todo: use getSize and update definition
            const dist: number = this._getCameraZ() - width;

            //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            let fov: number = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
            //let fov: number = 2 * Math.atan((width / this._getAspectRatio()) / (2 * dist)) * (180 / Math.PI);

            return fov;
        }

        private _loadProgress(progress: number): void {
            const fullWidth: number = this._$loading.offsetWidth;
            const width: number = Math.floor(fullWidth * progress);
            this._$loadingBar.style.width = String(width) + "px";
        }

        private _fullscreenChanged(): void {
            if (this._isFullscreen) { 
                // exiting fullscreen
                this.exitFullscreen();
                this._$element.style.width = String(this._lastWidth);
                this._$element.style.height = String(this._lastHeight);
            } else { 
                // entering fullscreen
                this._lastWidth = this._getWidth();
                this._lastHeight = this._getHeight();
            }
            
            this._isFullscreen = !this._isFullscreen;
            this._resize();
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
            
            //console.log(this._mousePosNorm);

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

        private _tick(): void {
            requestAnimFrame(() => this._tick());
            this._update();
            this._draw();
            if (this.options.data.showStats) {
                this._stats.update();
            }
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

        private _update(): void {
            
            // switch (this.options.data.type.toString()) {
            //     case FileType.DRACO.toString() :
            //         break;
            //     case FileType.GLTF.toString() :
            //         //THREE.GLTFLoader.Animations.update();
			//         THREE.GLTFLoader.Shaders.update(this.scene, this.camera);
            //         break;
            //     case FileType.THREEJS.toString() :
            //         break;
            // }
            
            if (this._isVRMode){
                // if (this._isMouseDown) {
                //     this.rotateY(0.1);
                // }

                // Update VR headset position and apply to camera.
                this._vrControls.update();  
            } else {
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
                
            }
        }

        private _draw(): void {
            if (this._isVRMode) {
                this._vrEffect.render(this.scene, this.camera);                
            } else {
                this._renderer.render(this.scene, this.camera);

                if (this._isMouseOver) {
                    this._$element.classList.add('grabbable');
                    if (this._isMouseDown) {
                        this._$element.classList.add('grabbing');
                    } else {
                        this._$element.classList.remove('grabbing');
                    }
                } else {
                    this._$element.classList.remove('grabbable');
                    this._$element.classList.remove('grabbing');
                }
            }
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
            if (this._isFullscreen){
                return window.innerWidth;
            }
            return this._$element.offsetWidth;
        }

        private _getHeight(): number {
            if (this._isFullscreen){
                return window.innerHeight;
            }
            return this._$element.offsetHeight;
        }

        private _getZoomSpeed(): number {
            return this._getBoundingWidth() * this.options.data.zoomSpeed;
        }

        private _getMaxZoom(): number {
            return this._getBoundingWidth() * this.options.data.maxZoom;
        }

        private _getMinZoom(): number {
            return this._getBoundingWidth() * this.options.data.minZoom;
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
            if (!this._vrEnabled) return;

            this._isVRMode = true;

            this._prevCameraPosition = this.camera.position.clone();
            this._prevCameraRotation = this.camera.rotation.clone();

            this._createControls();
            this._createRenderer();

            this._getVRDisplay().then((display) => {
                if (display) {
                    this._vrEffect.setVRDisplay(display);
                    this._vrControls.setVRDisplay(display);
                    this._vrEffect.setFullScreen(true);
                }
            });
        }
        
        public exitVR(): void {            
            if (!this._vrEnabled) return;            
            this._isVRMode = false;            
            this.camera.position.copy(this._prevCameraPosition);
            this.camera.rotation.copy(this._prevCameraRotation);
            this._createRenderer();
        }

        public toggleVR(): void {
            if (!this._vrEnabled) return;

            if (!this._isVRMode) {
                this.enterVR();
            } else {
                this.exitVR();
            }
        }
        
        public enterFullscreen(): void {            
            if (!this.options.data.fullscreenEnabled) return;            
            const elem: HTMLElement = this._$element;
            const requestFullScreen: any = this._getRequestFullScreen(elem);

            if (requestFullScreen){
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

        private _getAspectRatio(): number {
            return this._$viewport.offsetWidth / this._$viewport.offsetHeight;
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

        public resize(): void {
            this._resize();
        }

        protected _resize(): void {

            if (this._$element && this._$viewport) {
                
                const width: string = String(this._getWidth() + "px");
                const height: string = String(this._getHeight() + "px");

                this._$element.style.width = width;
                this._$element.style.height = height;

                this._$viewport.style.width = width;
                this._$viewport.style.height = height;

                this._viewportCenter.x = this._$viewport.offsetWidth / 2;
                this._viewportCenter.y = this._$viewport.offsetHeight / 2;

                this.camera.aspect = this._getAspectRatio();
                this.camera.updateProjectionMatrix();
                
                if (this._isVRMode) {
                    this._vrEffect.setSize(this._$viewport.offsetWidth, this._$viewport.offsetHeight);                    
                } else {
                    this._renderer.setSize(this._$viewport.offsetWidth, this._$viewport.offsetHeight);
                }

                this._$loading.style.left = String((this._viewportCenter.x) - (this._$loading.offsetWidth / 2)) + "px";
                this._$loading.style.top = String((this._viewportCenter.y) - (this._$loading.offsetHeight / 2)) + "px";
                
            } else if (this._$oldie) {
                this._$oldie.style.left = String((this._$element.offsetWidth / 2) - (this._$oldie.offsetWidth / 2)) + "px";
                this._$oldie.style.top = String((this._$element.offsetHeight / 2) - (this._$oldie.offsetHeight / 2)) + "px";
            }
        }
    }

    export class Events {
        static LOADED: string = 'loaded';
    }
}

(function(g: any) {
    if (!g.Virtex) {
        g.Virtex = Virtex;
    }
})(global);
