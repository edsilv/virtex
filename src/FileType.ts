namespace Virtex {
    export class FileType extends StringValue {
        public static DRACO = new FileType("application/draco");
        public static CORTO = new FileType("application/corto");
        public static GLTF = new FileType("model/gltf+json");
        public static OBJ = new FileType("text/plain");
        public static PLY = new FileType("application/ply");
        public static THREEJS = new FileType("application/vnd.threejs+json");
    }
}
