// virtex v0.3.6 https://github.com/edsilv/virtex#readme
declare var global: any;
declare var Stats: any;
interface Document {
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}
declare var WEBVR: any;

declare namespace Virtex {
    class StringValue {
        value: string;
        constructor(value?: string);
        toString(): string;
    }
}

declare namespace Virtex {
    class FileType extends StringValue {
        static DRACO: FileType;
        static CORTO: FileType;
        static GLTF: FileType;
        static OBJ: FileType;
        static PLY: FileType;
        static THREEJS: FileType;
    }
}

declare namespace Virtex {
    class CORTOFileTypeHandler {
        static setup(viewport: Viewport, obj: any, cb: (object: any) => void): void;
    }
}

declare namespace Virtex {
    class DRACOFileTypeHandler {
        static setup(viewport: Viewport, obj: any, cb: (object: any) => void): void;
    }
}

declare namespace Virtex {
    class glTFFileTypeHandler {
        static setup(viewport: Viewport, obj: any, cb: (object: any) => void): void;
    }
}

declare namespace Virtex {
    interface IVirtexData {
        alpha?: boolean;
        ambientLightColor?: number;
        ambientLightIntensity?: number;
        antialias?: boolean;
        cameraZ?: number;
        directionalLight1Color?: number;
        directionalLight1Intensity?: number;
        directionalLight2Color?: number;
        directionalLight2Intensity?: number;
        fadeSpeed?: number;
        far?: number;
        file: string;
        fullscreenEnabled?: boolean;
        maxZoom?: number;
        minZoom?: number;
        near?: number;
        shading?: THREE.Shading;
        showStats?: boolean;
        type?: FileType;
        backgroundColor?: number;
        zoomSpeed?: number;
    }
    interface IVirtexOptions {
        target: HTMLElement;
        data: IVirtexData;
    }
}

declare namespace Virtex {
    class ObjFileTypeHandler {
        static setup(viewport: Viewport, objpath: string, obj: any, cb: (object: any) => void): void;
    }
}

declare namespace Virtex {
    class PLYFileTypeHandler {
        static setup(viewport: Viewport, geometry: any, cb: (object: any) => void): void;
    }
}

declare namespace Virtex {
    class ThreeJSFileTypeHandler {
        static setup(viewport: Viewport, obj: any, cb: (object: any) => void): void;
    }
}

declare var Detector: any;
declare namespace Virtex {
    class Viewport {
        private _element;
        options: IVirtexOptions;
        private _clock;
        private _e;
        private _viewport;
        private _loading;
        private _loadingBar;
        private _oldie;
        private _lightGroup;
        private _prevCameraPosition;
        private _prevCameraRotation;
        private _raycaster;
        private _raycastObjectCache;
        private _renderer;
        private _stats;
        private _viewportCenter;
        camera: THREE.PerspectiveCamera;
        objectGroup: THREE.Group;
        scene: THREE.Scene;
        private _isFullscreen;
        private _isMouseDown;
        private _isVRMode;
        private _lastHeight;
        private _lastWidth;
        private _isMouseOver;
        private _mousePos;
        private _mousePosNorm;
        private _mousePosOnMouseDown;
        private _pinchStart;
        private _targetRotationOnMouseDown;
        private _targetRotation;
        private _targetZoom;
        constructor(options: IVirtexOptions);
        protected _init(): void;
        data(): IVirtexData;
        private _animate();
        private _onPointerRestricted();
        private _onPointerUnrestricted();
        private _createLights();
        createCamera(): void;
        private _createRenderer();
        private _createEventListeners();
        private _loadObject(objectPath);
        private _loaded(obj);
        private _getBoundingBox();
        private _getBoundingWidth();
        private _getBoundingHeight();
        private _getCameraZ();
        private _getFov();
        private _loadProgress(progress);
        private _fullscreenChanged();
        private _onMouseDown(event);
        private _onMouseMove(event);
        private _onMouseUp();
        private _onMouseOut();
        private _onMouseWheel(event);
        private _onTouchStart(event);
        private _onTouchMove(event);
        private _onTouchEnd();
        rotateY(radians: number): void;
        private _render();
        private _getRaycastObject();
        private _getWidth();
        private _getHeight();
        private _getZoomSpeed();
        private _getMaxZoom();
        private _getMinZoom();
        zoomIn(): void;
        zoomOut(): void;
        enterVR(): void;
        exitVR(): void;
        toggleVR(): void;
        enterFullscreen(): void;
        exitFullscreen(): void;
        private _getRequestFullScreen(elem);
        private _getExitFullScreen();
        private _getAspectRatio();
        on(name: string, callback: Function, ctx: any): void;
        fire(name: string, ...args: any[]): void;
        resize(): void;
        protected _resize(): void;
    }
    class Events {
        static LOADED: string;
    }
}
