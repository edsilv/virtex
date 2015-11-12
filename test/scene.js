var container, stats;

var camera, scene, renderer;

var group, text;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var scale = 1;
var zoomSpeed = 1;
var dollyStart = new THREE.Vector2();

//var pan = new THREE.Vector3();
//var panStart = new THREE.Vector2();

var objects = {
    thekiss: {
        model: 'models/kiss.json',
        texture: 'images/kiss.png',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 4.5,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        ambientLightColor: 0xc2c1be,
        directionalLight1Color: 0xc2c1be,
        directionalLight1Intensity: 0.65,
        directionalLight2Color: 0x002958,
        directionalLight2Intensity: 0.4,
        shininess: 1,
        shading: THREE.SmoothShading
    },
    nellis2: {
        model: 'models/nellis2.json',
        texture: 'images/nellis2.jpg',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 4.5,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        ambientLightColor: 0xc2c1be,
        directionalLight1Color: 0xc2c1be,
        directionalLight1Intensity: 0.65,
        directionalLight2Color: 0x002958,
        directionalLight2Intensity: 0.4,
        shininess: 1,
        shading: THREE.SmoothShading
    }
};

var currentObject = objects.nellis2;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

    camera.position.x = currentObject.cameraX;
    camera.position.y = currentObject.cameraY;
    camera.position.z = currentObject.cameraZ;

    scene = new THREE.Scene();

    //scene.fog = new THREE.FogExp2(0xefd1b5, 0.05);

    var light1 = new THREE.DirectionalLight(currentObject.directionalLight1Color, currentObject.directionalLight1Intensity);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(currentObject.directionalLight2Color, currentObject.directionalLight2Intensity);
    light2.position.set(-1, -1, -1);
    scene.add(light2);

    var light3 = new THREE.AmbientLight(currentObject.ambientLightColor);
    scene.add(light3);

    group = new THREE.Object3D();

    renderer = Detector.webgl? new THREE.WebGLRenderer({ antialias: true, alpha: true }): new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('mousewheel', onMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onMouseWheel, false); // firefox

    window.addEventListener('resize', onWindowResize, false);

    var texture = THREE.ImageUtils.loadTexture(currentObject.texture, {}, function(){
            textureLoaded(texture);
        },
        function(){
            alert('error')
        });
}

function textureLoaded(texture) {
    texture.minFilter = THREE.NearestFilter; // or THREE.LinearFilter when the texture is not a power of 2:
    material = new THREE.MeshPhongMaterial({ map: texture, shininess: currentObject.shininess, shading: currentObject.shading });

    var loader = new THREE.JSONLoader();
    loader.load(currentObject.model, modelLoaded);
}

function modelLoaded(geometry) {
    var mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    scene.add(group);

    group.translateX(currentObject.translateX);
    group.translateY(currentObject.translateY);
    group.translateZ(currentObject.translateZ);

    group.rotateX(currentObject.rotateX);
    group.rotateY(currentObject.rotateY);
    group.rotateZ(currentObject.rotateZ);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

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

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
    }
}

function onDocumentTouchMove(event) {

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {

        case 1: // one-fingered touch: rotate
            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

            mouseY = event.touches[0].pageY - windowHalfY;
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

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {

    // horizontal rotation
    group.rotation.y += (targetRotationX - group.rotation.y) * 0.1;

    // vertical rotation
    var finalRotationY = (targetRotationY - group.rotation.x);

    if (group.rotation.x <= 1 && group.rotation.x >= -1) {
        group.rotation.x += finalRotationY * 0.1;
    }

    if (group.rotation.x > 1) {
        group.rotation.x = 1
    } else if (group.rotation.x < -1) {
        group.rotation.x = -1
    }

    camera.position.z *= scale;
    //camera.position.add(pan);

    scale = 1;
    //pan.set(0, 0, 0);

    renderer.render(scene, camera);
}