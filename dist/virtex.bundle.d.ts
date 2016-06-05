// base-component v1.0.1 https://github.com/edsilv/base-component#readme

interface EventEmitter2Configuration {
    delimiter?: string;
    maxListeners?: number;
    wildcard?: string;
    newListener?: Function;
}

interface IEventEmitter2 {
    constructor(conf?: EventEmitter2Configuration);
    addListener(event: string, listener: Function): IEventEmitter2;
    on(event: string, listener: Function): IEventEmitter2;
    onAny(listener: Function): IEventEmitter2;
    offAny(listener: Function): IEventEmitter2;
    once(event: string, listener: Function): IEventEmitter2;
    many(event: string, timesToListen: number, listener: Function): IEventEmitter2;
    removeListener(event: string, listener: Function): IEventEmitter2;
    off(event: string, listener: Function): IEventEmitter2;
    removeAllListeners(event?: string): IEventEmitter2;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    listenersAny(): Function[];
    emit(event: string, ...args: any[]);
}

declare var EventEmitter2: IEventEmitter2;
declare namespace Components {
    class BaseComponent implements IBaseComponent {
        options: IBaseComponentOptions;
        protected _$element: JQuery;
        constructor(options: IBaseComponentOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IBaseComponentOptions;
        protected _emit(event: string, ...args: any[]): void;
        protected _resize(): void;
    }
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}

declare namespace Components {
    interface IBaseComponent {
        options: IBaseComponentOptions;
    }
}

declare namespace Components {
    interface IBaseComponentOptions {
        element?: string;
    }
}

declare module KeyCodes.KeyDown {
    var Backspace: number;
    var Tab: number;
    var Enter: number;
    var Shift: number;
    var Ctrl: number;
    var Alt: number;
    var PauseBreak: number;
    var CapsLock: number;
    var Escape: number;
    var Spacebar: number;
    var PageUp: number;
    var PageDown: number;
    var End: number;
    var Home: number;
    var LeftArrow: number;
    var UpArrow: number;
    var RightArrow: number;
    var DownArrow: number;
    var PrintScrn: number;
    var Insert: number;
    var Delete: number;
    var Zero: number;
    var One: number;
    var Two: number;
    var Three: number;
    var Four: number;
    var Five: number;
    var Six: number;
    var Seven: number;
    var Eight: number;
    var Nine: number;
    var a: number;
    var b: number;
    var c: number;
    var d: number;
    var e: number;
    var f: number;
    var g: number;
    var h: number;
    var i: number;
    var j: number;
    var k: number;
    var l: number;
    var m: number;
    var n: number;
    var o: number;
    var p: number;
    var q: number;
    var r: number;
    var s: number;
    var t: number;
    var u: number;
    var v: number;
    var w: number;
    var x: number;
    var y: number;
    var z: number;
    var LeftWindowKey: number;
    var RightWindowKey: number;
    var SelectKey: number;
    var Numpad0: number;
    var Numpad1: number;
    var Numpad2: number;
    var Numpad3: number;
    var Numpad4: number;
    var Numpad5: number;
    var Numpad6: number;
    var Numpad7: number;
    var Numpad8: number;
    var Numpad9: number;
    var Multiply: number;
    var NumpadPlus: number;
    var NumpadMinus: number;
    var DecimalPoint: number;
    var Divide: number;
    var F1: number;
    var F2: number;
    var F3: number;
    var F4: number;
    var F5: number;
    var F6: number;
    var F7: number;
    var F8: number;
    var F9: number;
    var F10: number;
    var F11: number;
    var F12: number;
    var NumLock: number;
    var ScrollLock: number;
    var Semicolon: number;
    var Equals: number;
    var Comma: number;
    var LessThan: number;
    var Dash: number;
    var Period: number;
    var GreaterThan: number;
    var ForwardSlash: number;
    var QuestionMark: number;
    var GraveAccent: number;
    var Tilde: number;
    var OpenCurlyBracket: number;
    var OpenSquareBracket: number;
    var BackSlash: number;
    var VerticalPipe: number;
    var CloseCurlyBracket: number;
    var CloseSquareBracket: number;
    var Quote: number;
    var CommandFF: number;
}
declare module KeyCodes.KeyPress {
    var Backspace: number;
    var Enter: number;
    var Spacebar: number;
    var Hash: number;
    var GraveAccent: number;
    var ForwardSlash: number;
    var Asterisk: number;
    var Plus: number;
    var Comma: number;
    var Minus: number;
    var Period: number;
    var ForwardSlash: number;
    var Zero: number;
    var One: number;
    var Two: number;
    var Three: number;
    var Four: number;
    var Five: number;
    var Six: number;
    var Seven: number;
    var Eight: number;
    var Nine: number;
    var Colon: number;
    var Semicolon: number;
    var LessThan: number;
    var Equals: number;
    var GreaterThan: number;
    var QuestionMark: number;
    var At: number;
    var OpenSquareBracket: number;
    var BackSlash: number;
    var CloseSquareBracket: number;
    var a: number;
    var b: number;
    var c: number;
    var d: number;
    var e: number;
    var f: number;
    var g: number;
    var h: number;
    var i: number;
    var j: number;
    var k: number;
    var l: number;
    var m: number;
    var n: number;
    var o: number;
    var p: number;
    var q: number;
    var r: number;
    var s: number;
    var t: number;
    var u: number;
    var v: number;
    var w: number;
    var x: number;
    var y: number;
    var z: number;
    var OpenCurlyBracket: number;
    var VerticalPipe: number;
    var CloseCurlyBracket: number;
    var Tilde: number;
}

interface Window{
    WebVRConfig: any;
}

interface VRDisplay{
    requestPresent: (options: any) => void;
}

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}

interface Navigator{
    getVRDisplays: () => Promise<VRDisplay[]>
}

declare module Virtex {
    interface IVirtexOptions extends Components.IBaseComponentOptions {
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
        webVRConfig: any;
        zoomSpeed?: number;
    }
}

declare var Detector: any;
declare var Stats: any;
declare var VRDisplay: any;
declare var requestAnimFrame: any;
declare module Virtex {
    class Viewport extends Components.BaseComponent {
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
        private _hmd;
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
        private _draw();
        rotateY(radians: number): void;
        private _render();
        private _getWidth();
        private _getHeight();
        zoomIn(): void;
        zoomOut(): void;
        enterVRMode(): void;
        private _completeVRMode();
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
