declare var Detector: any;
declare var Stats: any;

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 200);
        };
})();

module Virtex {
    export class Viewport {

        public options: IOptions;

        private _$element: JQuery;
        private _$viewport: JQuery;
        private _$loading: JQuery;
        private _$loadingBar: JQuery;
        private _$oldie: JQuery;

        private _camera: THREE.PerspectiveCamera;
        private _lightGroup: THREE.Group;
        private _modelGroup: THREE.Group;
        private _renderer: THREE.Renderer;
        private _scene: THREE.Scene;
        private _stats: any;
        private _viewportHalfX: number;
        private _viewportHalfY: number;

        private _isFullscreen: boolean = false;
        private _isVRMode: boolean = false;
        private _isMouseDown: boolean = false;
        private _lastHeight: number;
        private _lastWidth: number;
        private _mouseX: number = 0;
        private _mouseXOnMouseDown: number = 0;
        private _mouseY: number = 0;
        private _mouseYOnMouseDown: number = 0;
        private _pinchStart: THREE.Vector2 = new THREE.Vector2();
        private _targetRotationOnMouseDownX: number = 0;
        private _targetRotationOnMouseDownY: number = 0;
        private _targetRotationX: number = 0;
        private _targetRotationY: number = 0;
        private _targetZoom: number;
        private _vrControls: THREE.VRControls;
        private _vrEffect: THREE.VREffect;

        constructor(options: IOptions) {
            this.options = $.extend(this._getDefaultOptions(), options);

            if (!this.options.fullscreenEnabled){
                this.options.vrEnabled = false;
            }

            var success: boolean = this._init();

            this._resize();

            if (success){
                this._draw();
            }
        }

        private _getDefaultOptions(): IOptions {
            return <IOptions>{
                ambientLightColor: 0xd0d0d0,
                cameraZ: 4.5,
                directionalLight1Color: 0xffffff,
                directionalLight1Intensity: 0.75,
                directionalLight2Color: 0x002958,
                directionalLight2Intensity: 0.5,
                doubleSided: true,
                fadeSpeed: 1750,
                far: 10000,
                fov: 45,
                maxZoom: 10,
                minZoom: 2,
                near: 0.1,
                fullscreenEnabled: true,
                shading: THREE.SmoothShading,
                shininess: 1,
                showStats: false,
                vrEnabled: false,
                zoomSpeed: 1
            }
        }

        private _init(): boolean {

            this._$element = $(this.options.element);
            this._$element.empty();

            if (!this._$element.length){
                console.log('element not found');
                return false;
            }

            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                this._$oldie = $('#oldie');
                this._$oldie.appendTo(this._$element);
                return false;
            }

            this._$element.append('<div class="viewport"></div><div class="loading"><div class="bar"></div></div>');
            this._$viewport = this._$element.find('.viewport');
            this._$loading = this._$element.find('.loading');
            this._$loadingBar = this._$loading.find('.bar');
            this._$loading.hide();

            this._scene = new THREE.Scene();
            this._modelGroup = new THREE.Object3D();
            this._lightGroup = new THREE.Object3D();

            // LIGHTS //

            const light1 = new THREE.DirectionalLight(this.options.directionalLight1Color, this.options.directionalLight1Intensity);
            light1.position.set(1, 1, 1);
            this._lightGroup.add(light1);

            const light2 = new THREE.DirectionalLight(this.options.directionalLight2Color, this.options.directionalLight2Intensity);
            light2.position.set(-1, -1, -1);
            this._lightGroup.add(light2);

            const ambientLight = new THREE.AmbientLight(this.options.ambientLightColor);
            this._lightGroup.add(ambientLight);

            this._scene.add(this._lightGroup);

            this._createCamera();

            this._createRenderer();

            this._createEventListeners();

            this._loadObject(this.options.object);
            
            // STATS //

            if (this.options.showStats) {
                this._stats = new Stats();
                this._stats.domElement.style.position = 'absolute';
                this._stats.domElement.style.top = '0px';
                this._$viewport.append(this._stats.domElement);
            }

            return true;
        }

        private _createCamera(): void {
            this._camera = new THREE.PerspectiveCamera(this.options.fov, this._getWidth() / this._getHeight(), this.options.near, this.options.far);
            this._camera.position.z = this._targetZoom = this.options.cameraZ;
        }

        private _createRenderer(): void {

            this._renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            
            if (this._isVRMode){

                // Apply VR headset positional data to camera.
                this._vrControls = new THREE.VRControls(this._camera);

                // Apply VR stereo rendering to renderer.
                this._vrEffect = new THREE.VREffect(this._renderer);
                this._vrEffect.setSize(this._$viewport.width(), this._$viewport.height());
                
            } else {
                this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
            }

            this._$viewport.empty().append(this._renderer.domElement);
        }
        
        private _fullscreenChanged(): void {
            if (this._isFullscreen) { // exiting fullscreen
                this.exitFullscreen();
                this.exitVRMode();
                this._$element.width(this._lastWidth);
                this._$element.height(this._lastHeight);
            } else { // entering fullscreen
                this._lastWidth = this._getWidth();
                this._lastHeight = this._getHeight();
            }
            
            this._isFullscreen = !this._isFullscreen;
            this._resize();
        }
        
        private _createEventListeners(): void {
            
            if (this.options.fullscreenEnabled){
                $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', (e) => {
                    this._fullscreenChanged();
                });
            }
            
            this._$element.on('mousedown', (e) => {
                this._onMouseDown(<MouseEvent>e.originalEvent);
            });

            this._$element.on('mousemove', (e) => {
                this._onMouseMove(<MouseEvent>e.originalEvent);
            });

            this._$element.on('mouseup', (e) => {
                this._onMouseUp(<MouseEvent>e.originalEvent);
            });

            this._$element.on('mouseout', (e) => {
                this._onMouseOut(<MouseEvent>e.originalEvent);
            });

            this._$element.on('mousewheel', (e) => {
                this._onMouseWheel(<MouseWheelEvent>e.originalEvent);
            });

            this._$element.on('DOMMouseScroll', (e) => {
                this._onMouseWheel(<MouseWheelEvent>e.originalEvent); // firefox
            });

            this._$element.on('touchstart', (e) => {
                this._onTouchStart(<TouchEvent>e.originalEvent);
            });

            this._$element.on('touchmove', (e) => {
                this._onTouchMove(<TouchEvent>e.originalEvent);
            });

            this._$element.on('touchend', (e) => {
                this._onTouchEnd(<TouchEvent>e.originalEvent);
            });

            window.addEventListener('resize', () => this._resize(), false);
        }
        
        private _loadObject(object: string): void {
            this._$loading.show();

            var loader: THREE.ObjectLoader = new THREE.ObjectLoader();
            loader.setCrossOrigin('anonymous');

            loader.load(object,
                (obj: THREE.Object3D) => {

                    if (this.options.doubleSided){
                        obj.traverse((child: any) => {
                            if (child.material) child.material.side = THREE.DoubleSide;
                        });
                    }

                    this._modelGroup.add(obj);
                    this._scene.add(this._modelGroup);
                    this._$loading.fadeOut(this.options.fadeSpeed);
                },
                (e: ProgressEvent) => {
                    if (e.lengthComputable) {
                        this._loadProgress(e.loaded / e.total);
                    }
                },
                (e: ErrorEvent) => {
                    // error
                    console.log(e);
                }
            );
        }

        private _loadProgress(progress: number): void {
            var fullWidth = this._$loading.width();
            var width = Math.floor(fullWidth * progress);
            this._$loadingBar.width(width);
        }

        private _onMouseDown(event: MouseEvent): void {
            event.preventDefault();

            this._isMouseDown = true;

            this._mouseXOnMouseDown = event.clientX - this._viewportHalfX;
            this._targetRotationOnMouseDownX = this._targetRotationX;

            this._mouseYOnMouseDown = event.clientY - this._viewportHalfY;
            this._targetRotationOnMouseDownY = this._targetRotationY;
        }

        private _onMouseMove(event: MouseEvent): void {

            this._mouseX = event.clientX - this._viewportHalfX;
            this._mouseY = event.clientY - this._viewportHalfY;

            if (this._isMouseDown) {
                this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.02;
                this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.02;
            }
        }

        private _onMouseUp(event: MouseEvent): void {
            this._isMouseDown = false;
        }

        private _onMouseOut(event: MouseEvent): void {
            this._isMouseDown = false;
        }

        private _onMouseWheel(event: MouseWheelEvent): void {

            event.preventDefault();
            event.stopPropagation();

            var delta = 0;

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

            const touches = event.touches;

            if (touches.length === 1) {

                this._isMouseDown = true;

                event.preventDefault();

                this._mouseXOnMouseDown = touches[0].pageX - this._viewportHalfX;
                this._targetRotationOnMouseDownX = this._targetRotationX;

                this._mouseYOnMouseDown = touches[0].pageY - this._viewportHalfY;
                this._targetRotationOnMouseDownY = this._targetRotationY;
            }
        }

        private _onTouchMove(event: TouchEvent): void {

            event.preventDefault();
            event.stopPropagation();

            const touches = event.touches;

            switch (touches.length) {

                case 1: // one-fingered touch: rotate
                    event.preventDefault();

                    this._mouseX = touches[0].pageX - this._viewportHalfX;
                    this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.05;

                    this._mouseY = touches[0].pageY - this._viewportHalfY;
                    this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.05;

                    break;

                case 2: // two-fingered touch: zoom
                    var dx = touches[0].pageX - touches[1].pageX;
                    var dy = touches[0].pageY - touches[1].pageY;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    var pinchEnd = new THREE.Vector2(0, distance);
                    var pinchDelta = new THREE.Vector2();
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

        private _onTouchEnd(event: TouchEvent): void {
            this._isMouseDown = false;
        }

        private _draw(): void {
            requestAnimFrame(() => this._draw());
            this._render();
            if (this.options.showStats) {
                this._stats.update();
            }
        }

        private _render(): void {

            // horizontal rotation
            this._modelGroup.rotation.y += (this._targetRotationX - this._modelGroup.rotation.y) * 0.1;

            // vertical rotation
            var finalRotationY = (this._targetRotationY - this._modelGroup.rotation.x);

            if (this._modelGroup.rotation.x <= 1 && this._modelGroup.rotation.x >= -1) {
                this._modelGroup.rotation.x += finalRotationY * 0.1;
            }

            if (this._modelGroup.rotation.x > 1) {
                this._modelGroup.rotation.x = 1
            } else if (this._modelGroup.rotation.x < -1) {
                this._modelGroup.rotation.x = -1
            }

            var zoomDelta = (this._targetZoom - this._camera.position.z) * 0.1;
            
            this._camera.position.z = this._camera.position.z + zoomDelta;
            
            if (this._isVRMode){
                // Update VR headset position and apply to camera.
                this._vrControls.update();
                
                // Scene may be an array of two scenes, one for each eye.
                if (this._scene instanceof Array) {
                    this._vrEffect.render(this._scene[0], this._camera);
                } else {
                    this._vrEffect.render(this._scene, this._camera);
                }
                
            } else {
                this._renderer.render(this._scene, this._camera);
            }
        }

        private _getWidth(): number {
            if (this._isFullscreen){
                return window.innerWidth;
            }
            return this._$element.width();
        }

        private _getHeight(): number {
            if (this._isFullscreen){
                return window.innerHeight;
            }
            return this._$element.height();
        }

        public zoomIn(): void {
            var t = this._camera.position.z - this.options.zoomSpeed;
            if (t > this.options.minZoom){
                this._targetZoom = t;
            } else {
                this._targetZoom = this.options.minZoom;
            }
        }

        public zoomOut(): void {
            var t = this._camera.position.z + this.options.zoomSpeed;
            if (t < this.options.maxZoom){
                this._targetZoom = t;
            } else {
                this._targetZoom = this.options.maxZoom;
            }
        }
        
        public enterVRMode(): void {
            
            if (!this.options.vrEnabled) return;
            
            this._isVRMode = true;
            
            //this._modelGroup.position.z = -1;
            //this._modelGroup.position.y = -2.5;
            
            //this._createCamera();
            
            this._createRenderer();
            
            this.enterFullscreen();
        }
        
        public exitVRMode(): void {
            
            if (!this.options.vrEnabled) return;
            
            this._isVRMode = false;
            
            this._modelGroup.position.z = 0;
            
            this._createCamera();
            
            this._createRenderer();
        }
        
        public enterFullscreen(): void {
            
            if (!this.options.fullscreenEnabled) return;
            
            var elem = this._$element[0];

            var requestFullScreen = this._getRequestFullScreen(elem);

            if (requestFullScreen){
                requestFullScreen.call(elem);
            }
        }
        
        public exitFullscreen(): void {
            var exitFullScreen = this._getExitFullScreen();

            if (exitFullScreen) {
                exitFullScreen.call(document);
            }
        }
        
        private _getRequestFullScreen(elem) {

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

        private _getExitFullScreen() {

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

        private _resize(): void {

            if (this._$element && this._$viewport){
                
                this._$element.width(this._getWidth());
                this._$element.height(this._getHeight());

                this._$viewport.width(this._getWidth());
                this._$viewport.height(this._getHeight());

                this._viewportHalfX = this._$viewport.width() / 2;
                this._viewportHalfY = this._$viewport.height() / 2;

                this._camera.aspect = this._$viewport.width() / this._$viewport.height();
                this._camera.updateProjectionMatrix();
                
                if (this._isVRMode){
                    this._vrEffect.setSize(this._$viewport.width(), this._$viewport.height());                    
                } else {
                    this._renderer.setSize(this._$viewport.width(), this._$viewport.height());
                }

                this._$loading.css({
                    left: (this._viewportHalfX) - (this._$loading.width() / 2),
                    top: (this._viewportHalfY) - (this._$loading.height() / 2)
                });
                
            } else if (this._$oldie) {
                this._$oldie.css({
                    left: (this._$element.width() / 2) - (this._$oldie.outerWidth() / 2),
                    top: (this._$element.height() / 2) - (this._$oldie.outerHeight() / 2)
                });
            }
        }
    }
}