interface Window{
    WebVRConfig: any;
}

interface VRDisplay{
    requestPresent: (options: any) => void;
}

interface Document{
    mozFullScreen: boolean;
    msFullscreenElement: any;
    msExitFullscreen: any;
    mozCancelFullScreen: any;
}

interface Navigator{
    getVRDisplays: () => Promise<VRDisplay[]>
}