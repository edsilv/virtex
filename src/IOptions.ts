module Virtex{
    export interface IOptions {
        ambientLightColor: number;
        cameraZ: number;
        directionalLight1Color: number;
        directionalLight1Intensity: number;
        directionalLight2Color: number;
        directionalLight2Intensity: number;
        element: string;
        fadeSpeed: number;
        far: number;
        fov: number;
        near: number;
        object: string;
        shading: THREE.Shading;
        shininess: number;
        showStats: boolean;
    }
}