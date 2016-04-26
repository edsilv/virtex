module Virtex{
    export interface IOptions {
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
        maxZoom?: number;
        minZoom?: number;
        near?: number;
        object?: string;
        shading?: THREE.Shading;
        shininess?: number;
        showStats?: boolean;
        vrMode?: boolean;
        zoomSpeed?: number;
    }
}