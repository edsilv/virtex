namespace Virtex {
    export interface IVirtexData {
        ambientLightColor?: number;
        ambientLightIntensity?: number;
        cameraZ?: number;
        directionalLight1Color?: number;
        directionalLight1Intensity?: number;
        directionalLight2Color?: number;
        directionalLight2Intensity?: number;
        element?: string;
        fadeSpeed?: number;
        far?: number;
        file: string;
        fullscreenEnabled?: boolean;
        maxZoom?: number;
        minZoom?: number;
        near?: number;
        shading?: THREE.Shading;
        showStats?: boolean;
        type: FileType;
        vrBackgroundColor: number;
        zoomSpeed?: number;
    }
}