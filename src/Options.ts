module virtex {
    export class Options {
        public id: string;
        public object: string;
        public ambientLightColor: number;
        public cameraZ: number;
        public directionalLight1Color: number;
        public directionalLight1Intensity: number;
        public directionalLight2Color: number;
        public directionalLight2Intensity: number;
        public fadeSpeed: number;
        public far: number;
        public fov: number;
        public near: number;
        public shading: THREE.Shading;
        public shininess: number;
        public showStats: boolean;
    }
}