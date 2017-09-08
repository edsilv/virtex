///<reference path="../node_modules/typescript/lib/lib.es6.d.ts"/> 

declare var global: any;
declare var Stats: any;

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}