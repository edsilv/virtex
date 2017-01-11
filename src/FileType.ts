namespace Virtex {
    export class FileType extends StringValue {
        public static GLTF = new FileType("model/gltf+json");
        public static THREEJS = new FileType("application/vnd.threejs+json");
    }
}