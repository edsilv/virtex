namespace Virtex {
    export class ObjFileTypeHandler {

        static setup(viewport: Viewport, obj: any): void {
            viewport.objectGroup.add(obj);
            viewport.createCamera();
        }
    }
}