declare var Detector: any;
declare var Stats: any;

class Virtex {

    public options: IOptions;

    private _$element: JQuery;
    private _$viewport: JQuery;
    private _$loading: JQuery;
    private _$loadingBar: JQuery;

    private _stats: any;
    private _camera: THREE.PerspectiveCamera;
    private _scene: THREE.Scene;
    private _renderer: THREE.Renderer;
    private _lightGroup: THREE.Group;
    private _modelGroup: THREE.Group;
    private _viewportHalfX: number;
    private _viewportHalfY: number;

    private _targetRotationX: number = 0;
    private _targetRotationOnMouseDownX: number = 0;
    private _targetRotationY: number = 0;
    private _targetRotationOnMouseDownY: number = 0;
    private _mouseX: number = 0;
    private _mouseXOnMouseDown: number = 0;
    private _mouseY: number = 0;
    private _mouseYOnMouseDown: number = 0;

    private _scale: number = 1;
    private _zoomSpeed: number = 1;
    private _dollyStart: THREE.Vector2 = new THREE.Vector2();

    constructor(options: IOptions) {
        this.options = $.extend(<IOptions>{
            ambientLightColor: 0xc2c1be,
            cameraZ: 4.5,
            directionalLight1Color: 0xffffff,
            directionalLight1Intensity: 1,
            directionalLight2Color: 0x002958,
            directionalLight2Intensity: 0.5,
            fadeSpeed: 1750,
            far: 10000,
            fov: 45,
            near: 0.1,
            shading: THREE.SmoothShading,
            shininess: 1,
            showStats: false
        }, options);

        this._init();
        this._resize();
        this._draw();
    }

    private _init(): void {

        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this._$element = $(this.options.id);
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

        // CAMERA //

        this._camera = new THREE.PerspectiveCamera(this.options.fov, this._$viewport.width() / this._$viewport.height(), this.options.near, this.options.far);
        this._camera.position.z = this.options.cameraZ;

        // ACTION //

        // todo: test canvasrenderer, add to three.d.ts
        //this._renderer = Detector.webgl? new THREE.WebGLRenderer({ antialias: true, alpha: true }): new THREE.CanvasRenderer();
        this._renderer.setSize(this._$viewport.width(), this._$viewport.height());

        this._$viewport.append(this._renderer.domElement);

        if (this.options.showStats) {
            this._stats = new Stats();
            this._stats.domElement.style.position = 'absolute';
            this._stats.domElement.style.top = '0px';
            this._$viewport.append(this._stats.domElement);
        }

        document.addEventListener('mousedown', this._onDocumentMouseDown, false);
        document.addEventListener('touchstart', this._onDocumentTouchStart, false);
        document.addEventListener('touchmove', this._onDocumentTouchMove, false);
        document.addEventListener('mousewheel', this._onMouseWheel, false);
        document.addEventListener('DOMMouseScroll', this._onMouseWheel, false); // firefox
        window.addEventListener('resize', this._resize, false);

        var loadProgress = function(progress) {
            var fullWidth = this._$loading.width();
            var width = Math.floor(fullWidth * progress);
            this._$loadingBar.width(width);
        };

        var loader = new THREE.ObjectLoader();
        this._$loading.show();

        loader.load(this.options.object,
            (obj) => {
                this._modelGroup.add(obj);
                this._scene.add(this._modelGroup);
                this._$loading.fadeOut(this.options.fadeSpeed);
            },
            (xhr) => {
                loadProgress(xhr.loaded / xhr.total);
            },
            (e) => {
                // error
                console.log(e);
            }
        );
    }

    private _onDocumentMouseDown(event): void {
        event.preventDefault();

        document.addEventListener('mousemove', this._onDocumentMouseMove, false);
        document.addEventListener('mouseup', this._onDocumentMouseUp, false);
        document.addEventListener('mouseout', this._onDocumentMouseOut, false);

        this._mouseXOnMouseDown = event.clientX - this._viewportHalfX;
        this._targetRotationOnMouseDownX = this._targetRotationX;

        this._mouseYOnMouseDown = event.clientY - this._viewportHalfY;
        this._targetRotationOnMouseDownY = this._targetRotationY;
    }

    private _onDocumentMouseMove(event): void {
        this._mouseX = event.clientX - this._viewportHalfX;
        this._mouseY = event.clientY - this._viewportHalfY;

        this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.02;
        this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.02;
    }

    private _onDocumentMouseUp(event): void {
        document.removeEventListener('mousemove', this._onDocumentMouseMove, false);
        document.removeEventListener('mouseup', this._onDocumentMouseUp, false);
        document.removeEventListener('mouseout', this._onDocumentMouseOut, false);
    }

    private _onDocumentMouseOut(event): void {
        document.removeEventListener('mousemove', this._onDocumentMouseMove, false);
        document.removeEventListener('mouseup', this._onDocumentMouseUp, false);
        document.removeEventListener('mouseout', this._onDocumentMouseOut, false);
    }

    private _onDocumentTouchStart(event): void {

        if (event.touches.length === 1) {

            event.preventDefault();

            this._mouseXOnMouseDown = event.touches[0].pageX - this._viewportHalfX;
            this._targetRotationOnMouseDownX = this._targetRotationX;

            this._mouseYOnMouseDown = event.touches[0].pageY - this._viewportHalfY;
            this._targetRotationOnMouseDownY = this._targetRotationY;
        }
    }

    private _onDocumentTouchMove(event): void {

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate
                event.preventDefault();

                this._mouseX = event.touches[0].pageX - this._viewportHalfX;
                this._targetRotationX = this._targetRotationOnMouseDownX + (this._mouseX - this._mouseXOnMouseDown) * 0.05;

                this._mouseY = event.touches[0].pageY - this._viewportHalfY;
                this._targetRotationY = this._targetRotationOnMouseDownY + (this._mouseY - this._mouseYOnMouseDown) * 0.05;

                break;

            case 2: // two-fingered touch: dolly
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                var dollyEnd = new THREE.Vector2(0, distance);
                var dollyDelta = new THREE.Vector2();
                dollyDelta.subVectors(dollyEnd, this._dollyStart);

                if (dollyDelta.y > 0) {
                    this._dollyOut();
                } else if (dollyDelta.y < 0) {
                    this._dollyIn();
                }

                this._dollyStart.copy(dollyEnd);

                break;

            case 3: // three-fingered touch: pan

                //var panEnd = new THREE.Vector2();
                //panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                //var panDelta = new THREE.Vector2();
                //panDelta.subVectors(panEnd, panStart);
                //
                //panCamera(panDelta.x, panDelta.y);
                //
                //panStart.copy(panEnd);

                break;
        }
    }

    private _onMouseWheel(event): void {

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
            delta = event.wheelDelta;
        } else if (event.detail !== undefined) { // Firefox
            delta = - event.detail;
        }

        if (delta > 0) {
            this._dollyOut();
        } else if (delta < 0) {
            this._dollyIn();
        }
    }

    private _dollyIn(dollyScale?: number): void {

        if (dollyScale === undefined) {
            dollyScale = this._getZoomScale();
        }

        this._scale /= dollyScale;
    }

    private _dollyOut(dollyScale?: number): void {

        if (dollyScale === undefined) {
            dollyScale = this._getZoomScale();
        }

        this._scale *= dollyScale;
    }

    private _getZoomScale(): number {
        return Math.pow(0.95, this._zoomSpeed);
    }

    private _draw(): void {
        requestAnimationFrame(this._draw);
        this._render();
        if (this.options.showStats){
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

        this._camera.position.z *= this._scale;
        //camera.position.add(pan);

        this._scale = 1;
        //pan.set(0, 0, 0);

        this._renderer.render(this._scene, this._camera);
    }

    private _getWidth(): number {
        return this._$element.width();
    }

    private _getHeight(): number {
        return this._$element.height();
    }

    private _resize(): void {

        this._$element.width(this._getWidth());
        this._$element.height(this._getHeight());

        this._$viewport.width(this._getWidth());
        this._$viewport.height(this._getHeight());

        this._viewportHalfX = this._$viewport.width() / 2;
        this._viewportHalfY = this._$viewport.height() / 2;

        this._camera.aspect = this._$viewport.width() / this._$viewport.height();
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(this._$viewport.width(), this._$viewport.height());

        this._$loading.css({
            left: (this._viewportHalfX) - (this._$loading.width() / 2),
            top: (this._viewportHalfY) - (this._$loading.height() / 2)
        });
    }
}

export = Virtex;