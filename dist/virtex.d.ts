// virtex v0.3.7 https://github.com/edsilv/virtex#readme
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
        static setup(viewport: Viewport, obj: any): Promise<any>;
    }
}

declare namespace Virtex {
    class DRACOFileTypeHandler {
        static setup(viewport: Viewport, obj: any): Promise<any>;
    }
}

declare namespace Virtex {
    class glTFFileTypeHandler {
        static setup(viewport: Viewport, obj: any): Promise<any>;
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
        static setup(viewport: Viewport, objpath: string, obj: any): Promise<any>;
    }
}

declare namespace Virtex {
    class PLYFileTypeHandler {
        static setup(viewport: Viewport, geometry: any): Promise<any>;
    }
}

declare namespace Virtex {
    class ThreeJSFileTypeHandler {
        static setup(viewport: Viewport, obj: any): Promise<any>;
    }
}

declare var Detector: any;
declare namespace Virtex {
    class Viewport {
        private _clock;
        private _e;
        private _element;
        private _isFullscreen;
        private _isMouseDown;
        private _isMouseOver;
        private _lightGroup;
        private _loading;
        private _loadingBar;
        private _mousePos;
        private _mousePosNorm;
        private _mousePosOnMouseDown;
        private _oldie;
        private _pinchStart;
        private _prevCameraPosition;
        private _prevCameraRotation;
        private _prevObjectPosition;
        private _raycaster;
        private _raycastObjectCache;
        private _stats;
        private _targetRotation;
        private _targetRotationOnMouseDown;
        private _targetZoom;
        private _viewport;
        private _viewportCenter;
        private _vrDisplay;
        camera: THREE.PerspectiveCamera;
        objectGroup: THREE.Group;
        options: IVirtexOptions;
        renderer: THREE.WebGLRenderer;
        scene: THREE.Scene;
        constructor(options: IVirtexOptions);
        protected _init(): void;
        data(): IVirtexData;
        private _animate();
        private _onPointerRestricted();
        private _onPointerUnrestricted();
        private _createLights();
        createCamera(): void;
        private _createRenderer();
        private _setVRDisplay(vrDisplay);
        private _createDOMHandlers();
        private _loadObject(objectPath);
        private _loaded(obj);
        annotate(): void;
        private _getBoundingBox();
        private _getBoundingWidth();
        private _getBoundingHeight();
        private _getCameraZ();
        private _getFov();
        private _loadProgress(progress);
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
        private _getObjectsIntersectingWithMouse();
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
        private _getAspectRatio();
        on(name: string, callback: Function, ctx: any): void;
        fire(name: string, ...args: any[]): void;
        enterFullscreen(): void;
        exitFullscreen(): void;
        private _getRequestFullScreen(elem);
        private _getExitFullScreen();
        private _fullscreenChanged();
        resize(): void;
    }
    class Events {
        static ANNOTATION_TARGET: string;
        static LOADED: string;
        static VR_AVAILABLE: string;
        static VR_UNAVAILABLE: string;
    }
}
