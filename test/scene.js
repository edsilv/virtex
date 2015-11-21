var showStats = false;

var $element, $viewport, $loading, $loadingBar, stats, camera, scene, renderer, lightGroup, modelGroup, viewportHalfX, viewportHalfY;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;
var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;

var scale = 1;
var zoomSpeed = 1;
var dollyStart = new THREE.Vector2();
var width = 800;
var height = 600;

//var pan = new THREE.Vector3();
//var panStart = new THREE.Vector2();

var objects = {
    kiss: 'models/kiss.json',
    ecorche: 'objects/ecorche.json'
};

var currentObject = objects.ecorche;
var ambientLightColor = 0xc2c1be;
var cameraZ = 4.5;
var directionalLight1Color = 0xffffff;
var directionalLight1Intensity = 1;
var directionalLight2Color = 0x002958;
var directionalLight2Intensity = 0.5;
var fadeSpeed = 1750;
var far = 10000;
var fov = 45;
var near = 0.1;
var shading = THREE.SmoothShading;
var shininess = 1;

init();
resize();
draw();

function init() {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    $element = $('#virtex');
    $viewport = $element.find('.viewport');
    $loading = $element.find('.loading');
    $loadingBar = $loading.find('.bar');

    $loading.hide();

    scene = new THREE.Scene();

    modelGroup = new THREE.Object3D();
    lightGroup = new THREE.Object3D();

    // LIGHTS //

    var light1 = new THREE.DirectionalLight(directionalLight1Color, directionalLight1Intensity);
    light1.position.set(1, 1, 1);
    lightGroup.add(light1);

    var light2 = new THREE.DirectionalLight(directionalLight2Color, directionalLight2Intensity);
    light2.position.set(-1, -1, -1);
    lightGroup.add(light2);

    var ambientLight = new THREE.AmbientLight(ambientLightColor);
    lightGroup.add(ambientLight);

    scene.add(lightGroup);

    // CAMERA //

    camera = new THREE.PerspectiveCamera(fov, $viewport.width() / $viewport.height(), near, far);
    camera.position.z = cameraZ;

    // ACTION //

    renderer = Detector.webgl? new THREE.WebGLRenderer({ antialias: true, alpha: true }): new THREE.CanvasRenderer();
    renderer.setSize($viewport.width(), $viewport.height());

    $viewport.append(renderer.domElement);

    if (showStats) {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        $viewport.append(stats.domElement);
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('mousewheel', onMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    window.addEventListener('resize', resize, false);

    var loadProgress = function(progress) {
        var fullWidth = $loading.width();
        var width = Math.floor(fullWidth * progress);
        $loadingBar.width(width);
    };

    var loader = new THREE.ObjectLoader();
    $loading.show();

    loader.load(currentObject,
        function(obj) {
            modelGroup.add(obj);
            scene.add(modelGroup);
            $loading.fadeOut(fadeSpeed);
        },
        function(xhr) {
            loadProgress(xhr.loaded / xhr.total);
        },
        function(e) {
            // error
            console.log(e);
        }
    );
}

function resize() {

    $element.width(width);
    $element.height(height);

    $viewport.width(width);
    $viewport.height(height);

    viewportHalfX = $viewport.width() / 2;
    viewportHalfY = $viewport.height() / 2;

    camera.aspect = $viewport.width() / $viewport.height();
    camera.updateProjectionMatrix();

    renderer.setSize($viewport.width(), $viewport.height());

    $loading.css({
        left: (viewportHalfX) - ($loading.width() / 2),
        top: (viewportHalfY) - ($loading.height() / 2)
    });
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - viewportHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - viewportHalfY;
    targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - viewportHalfX;
    mouseY = event.clientY - viewportHalfY;

    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - viewportHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[0].pageY - viewportHalfY;
        targetRotationOnMouseDownY = targetRotationY;
    }
}

function onDocumentTouchMove(event) {

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {

        case 1: // one-fingered touch: rotate
            event.preventDefault();

            mouseX = event.touches[0].pageX - viewportHalfX;
            targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

            mouseY = event.touches[0].pageY - viewportHalfY;
            targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

            break;

        case 2: // two-fingered touch: dolly
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            var distance = Math.sqrt(dx * dx + dy * dy);

            var dollyEnd = new THREE.Vector2(0, distance);
            var dollyDelta = new THREE.Vector2();
            dollyDelta.subVectors(dollyEnd, dollyStart);

            if (dollyDelta.y > 0) {
                dollyOut();
            } else if (dollyDelta.y < 0) {
                dollyIn();
            }

            dollyStart.copy(dollyEnd);

            break;

        case 3: // three-fingered touch: pan

            //var panEnd = new THREE.Vector2();
            //panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
            //var panDelta = new THREE.Vector2();
            //panDelta.subVectors(panEnd, panStart);
            //
            //panCamera(panDelta.x, panDelta.y);
            //
            //panStart.copy(panEnd);

            break;
    }
}

function onMouseWheel(event) {

    event.preventDefault();
    event.stopPropagation();

    var delta = 0;

    if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
        delta = event.wheelDelta;
    } else if (event.detail !== undefined) { // Firefox
        delta = - event.detail;
    }

    if (delta > 0) {
        dollyOut();
    } else if (delta < 0) {
        dollyIn();
    }
}

// pass in distance in world space to move left
//function panLeft(distance) {
//
//    var te = group.matrix.elements;
//
//    // get X column of matrix
//    var panOffset = new THREE.Vector3();
//    panOffset.set(te[0], te[1], te[2]);
//    panOffset.multiplyScalar(- distance);
//
//    pan.add(panOffset);
//}
//
//// pass in distance in world space to move up
//function panUp(distance) {
//
//    var te = group.matrix.elements;
//
//    // get Y column of matrix
//    var panOffset = new THREE.Vector3();
//    panOffset.set(te[4], te[5], te[6]);
//    panOffset.multiplyScalar(distance);
//
//    pan.add(panOffset);
//}

//function panCamera(deltaX, deltaY) {
//
//    // perspective
//    var position = group.position;
//    var deltaOffset = new THREE.Vector3(deltaX, deltaY, 0);
//    var offset = position.clone().sub(deltaOffset);
//    var targetDistance = offset.length();
//
//    // half of the fov is center to top of screen
//    targetDistance *= Math.tan((camera.fov / 2) * Math.PI / 180.0);
//
//    // we actually don't use screenWidth, since perspective camera is fixed to screen height
//    panLeft(2 * deltaX * targetDistance / container.clientHeight);
//    panUp(2 * deltaY * targetDistance / container.clientHeight);
//}

function dollyIn(dollyScale) {

    if (dollyScale === undefined) {
        dollyScale = getZoomScale();
    }

    scale /= dollyScale;
}

function dollyOut(dollyScale) {

    if (dollyScale === undefined) {
        dollyScale = getZoomScale();
    }

    scale *= dollyScale;
}

function getZoomScale() {
    return Math.pow(0.95, zoomSpeed);
}

function draw() {
    requestAnimationFrame(draw);
    render();
    if (showStats){
        stats.update();
    }
}

function render() {

    // horizontal rotation
    modelGroup.rotation.y += (targetRotationX - modelGroup.rotation.y) * 0.1;

    // vertical rotation
    var finalRotationY = (targetRotationY - modelGroup.rotation.x);

    if (modelGroup.rotation.x <= 1 && modelGroup.rotation.x >= -1) {
        modelGroup.rotation.x += finalRotationY * 0.1;
    }

    if (modelGroup.rotation.x > 1) {
        modelGroup.rotation.x = 1
    } else if (modelGroup.rotation.x < -1) {
        modelGroup.rotation.x = -1
    }

    camera.position.z *= scale;
    //camera.position.add(pan);

    scale = 1;
    //pan.set(0, 0, 0);

    renderer.render(scene, camera);
}