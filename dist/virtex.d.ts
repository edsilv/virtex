// virtex v0.2.7 https://github.com/edsilv/virtex#readme

declare module Virtex {
    interface IVirtexOptions extends _Components.IBaseComponentOptions {
        ambientLightColor?: number;
        cameraZ?: number;
        directionalLight1Color?: number;
        directionalLight1Intensity?: number;
        directionalLight2Color?: number;
        directionalLight2Intensity?: number;
        doubleSided?: boolean;
        element?: string;
        fadeSpeed?: number;
        far?: number;
        fov?: number;
        fullscreenEnabled?: boolean;
        maxZoom?: number;
        minZoom?: number;
        near?: number;
        object?: string;
        shading?: THREE.Shading;
        shininess?: number;
        showStats?: boolean;
        vrBackgroundColor: number;
        zoomSpeed?: number;
    }
}

declare var Detector: any;
declare var Stats: any;
declare var WEBVR: any;
declare var requestAnimFrame: any;
declare module Virtex {
    class Viewport extends _Components.BaseComponent {
        options: IVirtexOptions;
        private _$viewport;
        private _$loading;
        private _$loadingBar;
        private _$oldie;
        private _camera;
        private _lightGroup;
        private _objectGroup;
        private _renderer;
        private _scene;
        private _stats;
        private _viewportHalfX;
        private _viewportHalfY;
        private _isFullscreen;
        private _isMouseDown;
        private _isVRMode;
        private _lastHeight;
        private _lastWidth;
        private _mouseX;
        private _mouseXOnMouseDown;
        private _mouseY;
        private _mouseYOnMouseDown;
        private _pinchStart;
        private _targetRotationOnMouseDownX;
        private _targetRotationOnMouseDownY;
        private _targetRotationX;
        private _targetRotationY;
        private _targetZoom;
        private _vrControls;
        private _vrEffect;
        private _vrEnabled;
        constructor(options: IVirtexOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IVirtexOptions;
        private _getVRDisplay();
        private _createLights();
        private _createCamera();
        private _createRenderer();
        private _createControls();
        private _createEventListeners();
        private _loadObject(object);
        private _loadProgress(progress);
        private _fullscreenChanged();
        private _onMouseDown(event);
        private _onMouseMove(event);
        private _onMouseUp(event);
        private _onMouseOut(event);
        private _onMouseWheel(event);
        private _onTouchStart(event);
        private _onTouchMove(event);
        private _onTouchEnd(event);
        private _tick();
        rotateY(radians: number): void;
        private _update();
        private _draw();
        private _getWidth();
        private _getHeight();
        zoomIn(): void;
        zoomOut(): void;
        enterVRMode(): void;
        exitVRMode(): void;
        enterFullscreen(): void;
        exitFullscreen(): void;
        private _getRequestFullScreen(elem);
        private _getExitFullScreen();
        protected _resize(): void;
    }
}
declare namespace Virtex {
    class Events {
        static LOADED: string;
    }
}
