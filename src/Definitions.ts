///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/> 

declare var global: any;
declare var Stats: any;

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}

declare module THREE {

    export class MTLLoader {
        constructor(manager?: LoadingManager);

        manager: LoadingManager;

        load(url: string, onLoad?: (object: Object3D) => void, onProgress?: (xhr: ProgressEvent) => void, onError?: (xhr: ErrorEvent) => void): void;
        setCrossOrigin(crossOrigin: string): void;
        setMaterials(materials: any): void;
        setPath(path: string): void;
    }

    export class GLTFLoader {
        constructor(manager?: LoadingManager);

        manager: LoadingManager;

        load(url: string, onLoad?: (object: Object3D) => void, onProgress?: (xhr: ProgressEvent) => void, onError?: (xhr: ErrorEvent) => void): void;
        setCrossOrigin(crossOrigin: string): void;

        static Animations: any;
        static Shaders: any;
    }

    export class DRACOLoader {
        constructor(manager?: LoadingManager);

        manager: LoadingManager;

        load(url: string, onLoad?: (object: Object3D) => void, onProgress?: (xhr: ProgressEvent) => void, onError?: (xhr: ErrorEvent) => void): void;
        setCrossOrigin(crossOrigin: string): void;
    }

    export class OBJLoader {
        constructor(manager?: LoadingManager);

        manager: LoadingManager;

        load(url: string, onLoad?: (object: Object3D) => void, onProgress?: (xhr: ProgressEvent) => void, onError?: (xhr: ErrorEvent) => void): void;
        setCrossOrigin(crossOrigin: string): void;
        setMaterials(materials: any): void;
    }
}