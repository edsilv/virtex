import * as _three from "three";

declare global {
    const THREE: typeof _three;
    const WEBVR: any;
    const Stats: any;
    const Detector: any

    interface Document{
        mozFullScreen: boolean;
        msFullscreenElement: any;
        msExitFullscreen: any;
        mozCancelFullScreen: any;
        webkitExitFullscreen: any;
        exitPointerLock: any;
        pointerLockElement: any;
    }

    interface HTMLCanvasElement {
        requestPointerLock: any;
    }
}
export {};