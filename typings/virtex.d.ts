interface Window{

}

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}

declare module THREE {
    export class GLTFLoader {
        constructor(manager?: LoadingManager);

        manager: LoadingManager;

        load(url: string, onLoad?: (object: Object3D) => void, onProgress?: (xhr: ProgressEvent) => void, onError?: (xhr: ErrorEvent) => void): void;
        setCrossOrigin(crossOrigin: string): void;
    }
}