interface IOptions {
    id: string;
    object: string;
    ambientLightColor: number;
    cameraZ: number;
    directionalLight1Color: number;
    directionalLight1Intensity: number;
    directionalLight2Color: number;
    directionalLight2Intensity: number;
    fadeSpeed: number;
    far: number;
    fov: number;
    near: number;
    shading: THREE.Shading;
    shininess: number;
    showStats: boolean;
}