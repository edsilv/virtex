namespace Virtex {
    export interface IVirtexData {
        alpha?: boolean;
        ambientLightColor?: number;
        ambientLightIntensity?: number;
        antialias?: boolean,
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
        dracoDecoderPath?: string;
    }

    export interface IVirtexOptions {
        target: HTMLElement;
        data: IVirtexData;
    }
}