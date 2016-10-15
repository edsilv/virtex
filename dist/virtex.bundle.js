(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TinyEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}]},{},[1])(1)
});
!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.baseComponent=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var _Components;!function(_Components){function applyMixins(derivedCtor,baseCtors){baseCtors.forEach(function(baseCtor){Object.getOwnPropertyNames(baseCtor.prototype).forEach(function(name){derivedCtor.prototype[name]=baseCtor.prototype[name]})})}var BaseComponent=function(){function BaseComponent(options){this.options=$.extend(this._getDefaultOptions(),options)}return BaseComponent.prototype._init=function(){return this._$element=$(this.options.element),this._$element.length?(this._$element.empty(),!0):(console.warn("element not found"),!1)},BaseComponent.prototype._getDefaultOptions=function(){return{}},BaseComponent.prototype._emit=function(event){for(var args=[],_i=1;_i<arguments.length;_i++)args[_i-1]=arguments[_i];this.emit(event,args)},BaseComponent.prototype._resize=function(){},BaseComponent.prototype.databind=function(data){},BaseComponent}();_Components.BaseComponent=BaseComponent,_Components.applyMixins=applyMixins,applyMixins(BaseComponent,[TinyEmitter])}(_Components||(_Components={})),function(w){w._Components||(w._Components=_Components)}(window)},{}]},{},[1])(1)});
/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError ) {

	var scope = this;

	var vrDisplay, vrDisplays;

	var standingMatrix = new THREE.Matrix4();

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'VR input not available.' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays ).catch ( function () {

			console.warn( 'THREE.VRControls: Unable to get VR Displays' );

		} );

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	// If true will use "standing space" coordinate system where y=0 is the
	// floor and x=0, z=0 is the center of the room.
	this.standing = false;

	// Distance from the users eyes to the floor in meters. Used when
	// standing=true but the VRDisplay doesn't provide stageParameters.
	this.userHeight = 1.6;

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.setVRDisplay = function ( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function () {

		console.warn( 'THREE.VRControls: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

	this.getStandingMatrix = function () {

		return standingMatrix;

	};

	this.update = function () {

		if ( vrDisplay ) {

			var pose;

			if ( vrDisplay.getFrameData ) {

				vrDisplay.getFrameData( frameData );
				pose = frameData.pose;

			} else if ( vrDisplay.getPose ) {

				pose = vrDisplay.getPose();

			}

			if ( pose.orientation !== null ) {

				object.quaternion.fromArray( pose.orientation );

			}

			if ( pose.position !== null ) {

				object.position.fromArray( pose.position );

			} else {

				object.position.set( 0, 0, 0 );

			}

			if ( this.standing ) {

				if ( vrDisplay.stageParameters ) {

					object.updateMatrix();

					standingMatrix.fromArray( vrDisplay.stageParameters.sittingToStandingTransform );
					object.applyMatrix( standingMatrix );

				} else {

					object.position.setY( object.position.y + this.userHeight );

				}

			}

			object.position.multiplyScalar( scope.scale );

		}

	};

	this.resetPose = function () {

		if ( vrDisplay ) {

			vrDisplay.resetPose();

		}

	};

	this.resetSensor = function () {

		console.warn( 'THREE.VRControls: .resetSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.zeroSensor = function () {

		console.warn( 'THREE.VRControls: .zeroSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.dispose = function () {

		vrDisplay = null;

	};

};

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://webvr.info/get-chrome
 *
 */

THREE.VREffect = function ( renderer, onError ) {

	var vrDisplay, vrDisplays;
	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'HMD not available' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays ).catch ( function () {

			console.warn( 'THREE.VREffect: Unable to get VR Displays' );

		} );

	}

	//

	this.isPresenting = false;
	this.scale = 1;

	var scope = this;

	var rendererSize = renderer.getSize();
	var rendererUpdateStyle = false;
	var rendererPixelRatio = renderer.getPixelRatio();

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.setVRDisplay = function ( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function () {

		console.warn( 'THREE.VREffect: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

	this.setSize = function ( width, height, updateStyle ) {

		rendererSize = { width: width, height: height };
		rendererUpdateStyle = updateStyle;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			renderer.setPixelRatio( 1 );
			renderer.setSize( eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false );

		} else {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( width, height, updateStyle );

		}

	};

	// fullscreen

	var canvas = renderer.domElement;
	var requestFullscreen;
	var exitFullscreen;
	var fullscreenElement;
	var defaultLeftBounds = [ 0.0, 0.0, 0.5, 1.0 ];
	var defaultRightBounds = [ 0.5, 0.0, 0.5, 1.0 ];

	function onVRDisplayPresentChange() {

		var wasPresenting = scope.isPresenting;
		scope.isPresenting = vrDisplay !== undefined && vrDisplay.isPresenting;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeWidth = eyeParamsL.renderWidth;
			var eyeHeight = eyeParamsL.renderHeight;

			if ( !wasPresenting ) {

				rendererPixelRatio = renderer.getPixelRatio();
				rendererSize = renderer.getSize();

				renderer.setPixelRatio( 1 );
				renderer.setSize( eyeWidth * 2, eyeHeight, false );

			}

		} else if ( wasPresenting ) {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( rendererSize.width, rendererSize.height, rendererUpdateStyle );

		}

	}

	window.addEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	this.setFullScreen = function ( boolean ) {

		return new Promise( function ( resolve, reject ) {

			if ( vrDisplay === undefined ) {

				reject( new Error( 'No VR hardware found.' ) );
				return;

			}

			if ( scope.isPresenting === boolean ) {

				resolve();
				return;

			}

			if ( boolean ) {

				resolve( vrDisplay.requestPresent( [ { source: canvas } ] ) );

			} else {

				resolve( vrDisplay.exitPresent() );

			}

		} );

	};

	this.requestPresent = function () {

		return this.setFullScreen( true );

	};

	this.exitPresent = function () {

		return this.setFullScreen( false );

	};

	this.requestAnimationFrame = function ( f ) {

		if ( vrDisplay !== undefined ) {

			return vrDisplay.requestAnimationFrame( f );

		} else {

			return window.requestAnimationFrame( f );

		}

	};

	this.cancelAnimationFrame = function ( h ) {

		if ( vrDisplay !== undefined ) {

			vrDisplay.cancelAnimationFrame( h );

		} else {

			window.cancelAnimationFrame( h );

		}

	};

	this.submitFrame = function () {

		if ( vrDisplay !== undefined && scope.isPresenting ) {

			vrDisplay.submitFrame();

		}

	};

	this.autoSubmitFrame = true;

	// render

	var cameraL = new THREE.PerspectiveCamera();
	cameraL.layers.enable( 1 );

	var cameraR = new THREE.PerspectiveCamera();
	cameraR.layers.enable( 2 );

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( vrDisplay && scope.isPresenting ) {

			var autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {

				scene.updateMatrixWorld();
				scene.autoUpdate = false;

			}

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeParamsR = vrDisplay.getEyeParameters( 'right' );

			eyeTranslationL.fromArray( eyeParamsL.offset );
			eyeTranslationR.fromArray( eyeParamsR.offset );

			if ( Array.isArray( scene ) ) {

				console.warn( 'THREE.VREffect.render() no longer supports arrays. Use object.layers instead.' );
				scene = scene[ 0 ];

			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			var layers = vrDisplay.getLayers();
			var leftBounds;
			var rightBounds;

			if ( layers.length ) {

				var layer = layers[ 0 ];

				leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : defaultLeftBounds;
				rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : defaultRightBounds;

			} else {

				leftBounds = defaultLeftBounds;
				rightBounds = defaultRightBounds;

			}

			renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height: Math.round(size.height * leftBounds[ 3 ] )
			};
			renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height: Math.round(size.height * rightBounds[ 3 ] )
			};

			if ( renderTarget ) {

				renderer.setRenderTarget( renderTarget );
				renderTarget.scissorTest = true;

			} else {

				renderer.setRenderTarget( null );
				renderer.setScissorTest( true );

			}

			if ( renderer.autoClear || forceClear ) renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
			camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );

			var scale = this.scale;
			cameraL.translateOnAxis( eyeTranslationL, scale );
			cameraR.translateOnAxis( eyeTranslationR, scale );

			if ( vrDisplay.getFrameData ) {

				vrDisplay.depthNear = camera.near;
				vrDisplay.depthFar = camera.far;

				vrDisplay.getFrameData( frameData );

				cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
				cameraR.projectionMatrix.elements = frameData.rightProjectionMatrix;

			} else {

				cameraL.projectionMatrix = fovToProjection( eyeParamsL.fieldOfView, true, camera.near, camera.far );
				cameraR.projectionMatrix = fovToProjection( eyeParamsR.fieldOfView, true, camera.near, camera.far );

			}

			// render left eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderTarget.scissor.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			} else {

				renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			}
			renderer.render( scene, cameraL, renderTarget, forceClear );

			// render right eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderTarget.scissor.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			} else {

				renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			}
			renderer.render( scene, cameraR, renderTarget, forceClear );

			if ( renderTarget ) {

				renderTarget.viewport.set( 0, 0, size.width, size.height );
				renderTarget.scissor.set( 0, 0, size.width, size.height );
				renderTarget.scissorTest = false;
				renderer.setRenderTarget( null );

			} else {

				renderer.setViewport( 0, 0, size.width, size.height );
				renderer.setScissorTest( false );

			}

			if ( autoUpdate ) {

				scene.autoUpdate = true;

			}

			if ( scope.autoSubmitFrame ) {

				scope.submitFrame();

			}

			return;

		}

		// Regular render mode if not HMD

		renderer.render( scene, camera, renderTarget, forceClear );

	};

	this.dispose = function () {

		window.removeEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	};

	//

	function fovToNDCScaleOffset( fov ) {

		var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
		var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
		var pyscale = 2.0 / ( fov.upTan + fov.downTan );
		var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
		return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

	}

	function fovPortToProjection( fov, rightHanded, zNear, zFar ) {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? - 1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = fovToNDCScaleOffset( fov );

		// X result, map clip edges to [-w,+w]
		m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
		m[ 0 * 4 + 1 ] = 0.0;
		m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
		m[ 0 * 4 + 3 ] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[ 1 * 4 + 0 ] = 0.0;
		m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
		m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
		m[ 1 * 4 + 3 ] = 0.0;

		// Z result (up to the app)
		m[ 2 * 4 + 0 ] = 0.0;
		m[ 2 * 4 + 1 ] = 0.0;
		m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
		m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

		// W result (= Z in)
		m[ 3 * 4 + 0 ] = 0.0;
		m[ 3 * 4 + 1 ] = 0.0;
		m[ 3 * 4 + 2 ] = handednessScale;
		m[ 3 * 4 + 3 ] = 0.0;

		mobj.transpose();

		return mobj;

	}

	function fovToProjection( fov, rightHanded, zNear, zFar ) {

		var DEG2RAD = Math.PI / 180.0;

		var fovPort = {
			upTan: Math.tan( fov.upDegrees * DEG2RAD ),
			downTan: Math.tan( fov.downDegrees * DEG2RAD ),
			leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
			rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
		};

		return fovPortToProjection( fovPort, rightHanded, zNear, zFar );

	}

};

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () {

		try {

			var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );

		} catch ( e ) {

			return false;

		}

	} )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.id = 'webgl-error-message';
		element.style.fontFamily = 'monospace';
		element.style.fontSize = '13px';
		element.style.fontWeight = 'normal';
		element.style.textAlign = 'center';
		element.style.background = '#fff';
		element.style.color = '#000';
		element.style.padding = '1.5em';
		element.style.width = '400px';
		element.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function ( parameters ) {

		var parent, id, element;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		element = Detector.getWebGLErrorMessage();
		element.id = id;

		parent.appendChild( element );

	}

};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = Detector;

}

var KeyCodes;
(function (KeyCodes) {
    var KeyDown;
    (function (KeyDown) {
        KeyDown.Backspace = 8;
        KeyDown.Tab = 9;
        KeyDown.Enter = 13;
        KeyDown.Shift = 16;
        KeyDown.Ctrl = 17;
        KeyDown.Alt = 18;
        KeyDown.PauseBreak = 19;
        KeyDown.CapsLock = 20;
        KeyDown.Escape = 27;
        KeyDown.Spacebar = 32;
        KeyDown.PageUp = 33;
        KeyDown.PageDown = 34;
        KeyDown.End = 35;
        KeyDown.Home = 36;
        KeyDown.LeftArrow = 37;
        KeyDown.UpArrow = 38;
        KeyDown.RightArrow = 39;
        KeyDown.DownArrow = 40;
        KeyDown.PrintScrn = 44;
        KeyDown.Insert = 45;
        KeyDown.Delete = 46;
        KeyDown.Zero = 48;
        KeyDown.One = 49;
        KeyDown.Two = 50;
        KeyDown.Three = 51;
        KeyDown.Four = 52;
        KeyDown.Five = 53;
        KeyDown.Six = 54;
        KeyDown.Seven = 55;
        KeyDown.Eight = 56;
        KeyDown.Nine = 57;
        KeyDown.a = 65;
        KeyDown.b = 66;
        KeyDown.c = 67;
        KeyDown.d = 68;
        KeyDown.e = 69;
        KeyDown.f = 70;
        KeyDown.g = 71;
        KeyDown.h = 72;
        KeyDown.i = 73;
        KeyDown.j = 74;
        KeyDown.k = 75;
        KeyDown.l = 76;
        KeyDown.m = 77;
        KeyDown.n = 78;
        KeyDown.o = 79;
        KeyDown.p = 80;
        KeyDown.q = 81;
        KeyDown.r = 82;
        KeyDown.s = 83;
        KeyDown.t = 84;
        KeyDown.u = 85;
        KeyDown.v = 86;
        KeyDown.w = 87;
        KeyDown.x = 88;
        KeyDown.y = 89;
        KeyDown.z = 90;
        KeyDown.LeftWindowKey = 91;
        KeyDown.RightWindowKey = 92;
        KeyDown.SelectKey = 93;
        KeyDown.Numpad0 = 96;
        KeyDown.Numpad1 = 97;
        KeyDown.Numpad2 = 98;
        KeyDown.Numpad3 = 99;
        KeyDown.Numpad4 = 100;
        KeyDown.Numpad5 = 101;
        KeyDown.Numpad6 = 102;
        KeyDown.Numpad7 = 103;
        KeyDown.Numpad8 = 104;
        KeyDown.Numpad9 = 105;
        KeyDown.Multiply = 106;
        KeyDown.NumpadPlus = 107;
        KeyDown.NumpadMinus = 109;
        KeyDown.DecimalPoint = 110;
        KeyDown.Divide = 111;
        KeyDown.F1 = 112;
        KeyDown.F2 = 113;
        KeyDown.F3 = 114;
        KeyDown.F4 = 115;
        KeyDown.F5 = 116;
        KeyDown.F6 = 117;
        KeyDown.F7 = 118;
        KeyDown.F8 = 119;
        KeyDown.F9 = 120;
        KeyDown.F10 = 121;
        KeyDown.F11 = 122;
        KeyDown.F12 = 123;
        KeyDown.NumLock = 144;
        KeyDown.ScrollLock = 145;
        KeyDown.Semicolon = 186;
        KeyDown.Equals = 187;
        KeyDown.Comma = 188;
        KeyDown.LessThan = 188;
        KeyDown.Dash = 189;
        KeyDown.Period = 190;
        KeyDown.GreaterThan = 190;
        KeyDown.ForwardSlash = 191;
        KeyDown.QuestionMark = 191;
        KeyDown.GraveAccent = 192;
        KeyDown.Tilde = 192;
        KeyDown.OpenCurlyBracket = 219;
        KeyDown.OpenSquareBracket = 219;
        KeyDown.BackSlash = 220;
        KeyDown.VerticalPipe = 220;
        KeyDown.CloseCurlyBracket = 221;
        KeyDown.CloseSquareBracket = 221;
        KeyDown.Quote = 222;
        KeyDown.CommandFF = 224;
    })(KeyDown = KeyCodes.KeyDown || (KeyCodes.KeyDown = {}));
})(KeyCodes || (KeyCodes = {}));
var KeyCodes;
(function (KeyCodes) {
    var KeyPress;
    (function (KeyPress) {
        KeyPress.Backspace = 8;
        KeyPress.Enter = 13;
        KeyPress.Spacebar = 32;
        KeyPress.Hash = 35;
        KeyPress.GraveAccent = 39;
        KeyPress.ForwardSlash = 32;
        KeyPress.Asterisk = 42;
        KeyPress.Plus = 43;
        KeyPress.Comma = 44;
        KeyPress.Minus = 45;
        KeyPress.Period = 46;
        KeyPress.ForwardSlash = 47;
        KeyPress.Zero = 48;
        KeyPress.One = 49;
        KeyPress.Two = 50;
        KeyPress.Three = 51;
        KeyPress.Four = 52;
        KeyPress.Five = 53;
        KeyPress.Six = 54;
        KeyPress.Seven = 55;
        KeyPress.Eight = 56;
        KeyPress.Nine = 57;
        KeyPress.Colon = 58;
        KeyPress.Semicolon = 59;
        KeyPress.LessThan = 60;
        KeyPress.Equals = 61;
        KeyPress.GreaterThan = 62;
        KeyPress.QuestionMark = 63;
        KeyPress.At = 64;
        KeyPress.OpenSquareBracket = 91;
        KeyPress.BackSlash = 92;
        KeyPress.CloseSquareBracket = 93;
        KeyPress.a = 97;
        KeyPress.b = 98;
        KeyPress.c = 99;
        KeyPress.d = 100;
        KeyPress.e = 101;
        KeyPress.f = 102;
        KeyPress.g = 103;
        KeyPress.h = 104;
        KeyPress.i = 105;
        KeyPress.j = 106;
        KeyPress.k = 107;
        KeyPress.l = 108;
        KeyPress.m = 109;
        KeyPress.n = 110;
        KeyPress.o = 111;
        KeyPress.p = 112;
        KeyPress.q = 113;
        KeyPress.r = 114;
        KeyPress.s = 115;
        KeyPress.t = 116;
        KeyPress.u = 117;
        KeyPress.v = 118;
        KeyPress.w = 119;
        KeyPress.x = 120;
        KeyPress.y = 121;
        KeyPress.z = 122;
        KeyPress.OpenCurlyBracket = 123;
        KeyPress.VerticalPipe = 124;
        KeyPress.CloseCurlyBracket = 125;
        KeyPress.Tilde = 126;
    })(KeyPress = KeyCodes.KeyPress || (KeyCodes.KeyPress = {}));
})(KeyCodes || (KeyCodes = {}));

!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.virtex=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var Virtex,__extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,5)}}();!function(Virtex){var Viewport=function(_super){function Viewport(options){_super.call(this,options),this._viewportCenter=new THREE.Vector2,this._isFullscreen=!1,this._isMouseDown=!1,this._isVRMode=!1,this._mousePos=new THREE.Vector2,this._mousePosOnMouseDown=new THREE.Vector2,this._pinchStart=new THREE.Vector2,this._targetRotationOnMouseDown=new THREE.Vector2,this._targetRotation=new THREE.Vector2,this._vrEnabled=!0;var success=this._init();this._resize(),success&&this._tick()}return __extends(Viewport,_super),Viewport.prototype._init=function(){var success=_super.prototype._init.call(this);return success?Detector.webgl?(this._$element.append('<div class="viewport"></div><div class="loading"><div class="bar"></div></div>'),this._$viewport=this._$element.find(".viewport"),this._$loading=this._$element.find(".loading"),this._$loadingBar=this._$loading.find(".bar"),this._$loading.hide(),this._scene=new THREE.Scene,this._objectGroup=new THREE.Object3D,this._scene.add(this._objectGroup),this._createLights(),this._createCamera(),this._createControls(),this._createRenderer(),this._createEventListeners(),this._loadObject(this.options.object),this.options.showStats&&(this._stats=new Stats,this._stats.domElement.style.position="absolute",this._stats.domElement.style.top="0px",this._$viewport.append(this._stats.domElement)),!0):(Detector.addGetWebGLMessage(),this._$oldie=$("#oldie"),this._$oldie.appendTo(this._$element),!1):(console.error("Virtex failed to initialise"),!1)},Viewport.prototype._getDefaultOptions=function(){return{ambientLightColor:13684944,cameraZ:4.5,directionalLight1Color:16777215,directionalLight1Intensity:.75,directionalLight2Color:10584,directionalLight2Intensity:.5,doubleSided:!0,fadeSpeed:1750,far:1e4,fov:45,maxZoom:10,minZoom:2,near:.1,fullscreenEnabled:!0,shading:THREE.SmoothShading,shininess:1,showStats:!1,vrBackgroundColor:0,zoomSpeed:1}},Viewport.prototype._getVRDisplay=function(){return new Promise(function(resolve,reject){navigator.getVRDisplays().then(function(devices){for(var i=0;i<devices.length;i++)if(devices[i]instanceof VRDisplay){resolve(devices[i]);break}resolve(null)},function(){resolve(null)})})},Viewport.prototype._createLights=function(){this._lightGroup=new THREE.Object3D,this._scene.add(this._lightGroup);var light1=new THREE.DirectionalLight(this.options.directionalLight1Color,this.options.directionalLight1Intensity);light1.position.set(1,1,1),this._lightGroup.add(light1);var light2=new THREE.DirectionalLight(this.options.directionalLight2Color,this.options.directionalLight2Intensity);light2.position.set(-1,-1,-1),this._lightGroup.add(light2);var ambientLight=new THREE.AmbientLight(this.options.ambientLightColor);this._lightGroup.add(ambientLight)},Viewport.prototype._createCamera=function(){this._camera=new THREE.PerspectiveCamera(this.options.fov,this._getWidth()/this._getHeight(),this.options.near,this.options.far),this._camera.position.z=this._targetZoom=this.options.cameraZ},Viewport.prototype._createRenderer=function(){this._renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),this._isVRMode?(this._renderer.setClearColor(this.options.vrBackgroundColor),this._vrEffect=new THREE.VREffect(this._renderer),this._vrEffect.setSize(this._$viewport.width(),this._$viewport.height())):(this._renderer.setClearColor(this.options.vrBackgroundColor,0),this._renderer.setSize(this._$viewport.width(),this._$viewport.height())),this._$viewport.empty().append(this._renderer.domElement)},Viewport.prototype._createControls=function(){this._isVRMode&&(this._vrControls=new THREE.VRControls(this._camera))},Viewport.prototype._createEventListeners=function(){var _this=this;this.options.fullscreenEnabled&&$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",function(e){_this._fullscreenChanged()}),this._$element.on("mousedown",function(e){_this._onMouseDown(e.originalEvent)}),this._$element.on("mousemove",function(e){_this._onMouseMove(e.originalEvent)}),this._$element.on("mouseup",function(e){_this._onMouseUp(e.originalEvent)}),this._$element.on("mouseout",function(e){_this._onMouseOut(e.originalEvent)}),this._$element.on("mousewheel",function(e){_this._onMouseWheel(e.originalEvent)}),this._$element.on("DOMMouseScroll",function(e){_this._onMouseWheel(e.originalEvent)}),this._$element.on("touchstart",function(e){_this._onTouchStart(e.originalEvent)}),this._$element.on("touchmove",function(e){_this._onTouchMove(e.originalEvent)}),this._$element.on("touchend",function(e){_this._onTouchEnd(e.originalEvent)}),window.addEventListener("resize",function(){return _this._resize()},!1)},Viewport.prototype._loadObject=function(object){var _this=this;this._$loading.show();var loader=new THREE.ObjectLoader;loader.setCrossOrigin("anonymous"),loader.load(object,function(obj){_this.options.doubleSided&&obj.traverse(function(child){child.material&&(child.material.side=THREE.DoubleSide)}),_this._objectGroup.add(obj),_this._$loading.fadeOut(_this.options.fadeSpeed),_this._emit(Virtex.Events.LOADED,obj)},function(e){e.lengthComputable&&_this._loadProgress(e.loaded/e.total)},function(e){console.error(e)})},Viewport.prototype._loadProgress=function(progress){var fullWidth=this._$loading.width(),width=Math.floor(fullWidth*progress);this._$loadingBar.width(width)},Viewport.prototype._fullscreenChanged=function(){this._isFullscreen?(this.exitFullscreen(),this._$element.width(this._lastWidth),this._$element.height(this._lastHeight)):(this._lastWidth=this._getWidth(),this._lastHeight=this._getHeight()),this._isFullscreen=!this._isFullscreen,this._resize()},Viewport.prototype._onMouseDown=function(event){event.preventDefault(),this._isMouseDown=!0,this._mousePosOnMouseDown.x=event.clientX-this._viewportCenter.x,this._targetRotationOnMouseDown.x=this._targetRotation.x,this._mousePosOnMouseDown.y=event.clientY-this._viewportCenter.y,this._targetRotationOnMouseDown.y=this._targetRotation.y},Viewport.prototype._onMouseMove=function(event){this._mousePos.x=event.clientX-this._viewportCenter.x,this._mousePos.y=event.clientY-this._viewportCenter.y,this._isMouseDown&&(this._targetRotation.y=this._targetRotationOnMouseDown.y+.02*(this._mousePos.y-this._mousePosOnMouseDown.y),this._targetRotation.x=this._targetRotationOnMouseDown.x+.02*(this._mousePos.x-this._mousePosOnMouseDown.x))},Viewport.prototype._onMouseUp=function(event){this._isMouseDown=!1},Viewport.prototype._onMouseOut=function(event){this._isMouseDown=!1},Viewport.prototype._onMouseWheel=function(event){event.preventDefault(),event.stopPropagation();var delta=0;void 0!==event.wheelDelta?delta=event.wheelDelta:void 0!==event.detail&&(delta=-event.detail),delta>0?this.zoomIn():delta<0&&this.zoomOut()},Viewport.prototype._onTouchStart=function(event){var touches=event.touches;1===touches.length&&(this._isMouseDown=!0,event.preventDefault(),this._mousePosOnMouseDown.x=touches[0].pageX-this._viewportCenter.x,this._targetRotationOnMouseDown.x=this._targetRotation.x,this._mousePosOnMouseDown.y=touches[0].pageY-this._viewportCenter.y,this._targetRotationOnMouseDown.y=this._targetRotation.y)},Viewport.prototype._onTouchMove=function(event){event.preventDefault(),event.stopPropagation();var touches=event.touches;switch(touches.length){case 1:event.preventDefault(),this._mousePos.x=touches[0].pageX-this._viewportCenter.x,this._targetRotation.x=this._targetRotationOnMouseDown.x+.05*(this._mousePos.x-this._mousePosOnMouseDown.x),this._mousePos.y=touches[0].pageY-this._viewportCenter.y,this._targetRotation.y=this._targetRotationOnMouseDown.y+.05*(this._mousePos.y-this._mousePosOnMouseDown.y);break;case 2:var dx=touches[0].pageX-touches[1].pageX,dy=touches[0].pageY-touches[1].pageY,distance=Math.sqrt(dx*dx+dy*dy),pinchEnd=new THREE.Vector2(0,distance),pinchDelta=new THREE.Vector2;pinchDelta.subVectors(pinchEnd,this._pinchStart),pinchDelta.y>0?this.zoomIn():pinchDelta.y<0&&this.zoomOut(),this._pinchStart.copy(pinchEnd);break;case 3:}},Viewport.prototype._onTouchEnd=function(event){this._isMouseDown=!1},Viewport.prototype._tick=function(){var _this=this;requestAnimFrame(function(){return _this._tick()}),this._update(),this._draw(),this.options.showStats&&this._stats.update()},Viewport.prototype.rotateY=function(radians){var rotation=this._objectGroup.rotation.y+radians;this._objectGroup.rotation.y=rotation},Viewport.prototype._update=function(){if(this._isVRMode)this._vrControls.update();else{this.rotateY(.1*(this._targetRotation.x-this._objectGroup.rotation.y));var finalRotationY=this._targetRotation.y-this._objectGroup.rotation.x;this._objectGroup.rotation.x<=1&&this._objectGroup.rotation.x>=-1&&(this._objectGroup.rotation.x+=.1*finalRotationY),this._objectGroup.rotation.x>1?this._objectGroup.rotation.x=1:this._objectGroup.rotation.x<-1&&(this._objectGroup.rotation.x=-1);var zoomDelta=.1*(this._targetZoom-this._camera.position.z);this._camera.position.z+=zoomDelta}},Viewport.prototype._draw=function(){this._isVRMode?this._vrEffect.render(this._scene,this._camera):this._renderer.render(this._scene,this._camera)},Viewport.prototype._getWidth=function(){return this._isFullscreen?window.innerWidth:this._$element.width()},Viewport.prototype._getHeight=function(){return this._isFullscreen?window.innerHeight:this._$element.height()},Viewport.prototype.zoomIn=function(){var t=this._camera.position.z-this.options.zoomSpeed;t>this.options.minZoom?this._targetZoom=t:this._targetZoom=this.options.minZoom},Viewport.prototype.zoomOut=function(){var t=this._camera.position.z+this.options.zoomSpeed;t<this.options.maxZoom?this._targetZoom=t:this._targetZoom=this.options.maxZoom},Viewport.prototype.enterVR=function(){var _this=this;this._vrEnabled&&(this._isVRMode=!0,this._createControls(),this._createRenderer(),this._getVRDisplay().then(function(display){display&&(_this._vrEffect.setVRDisplay(display),_this._vrControls.setVRDisplay(display),_this._vrEffect.setFullScreen(!0))}))},Viewport.prototype.exitVR=function(){this._vrEnabled&&(this._isVRMode=!1,this._createCamera(),this._createRenderer())},Viewport.prototype.toggleVR=function(){this._vrEnabled&&(this._isVRMode?this.exitVR():this.enterVR())},Viewport.prototype.enterFullscreen=function(){if(this.options.fullscreenEnabled){var elem=this._$element[0],requestFullScreen=this._getRequestFullScreen(elem);requestFullScreen&&requestFullScreen.call(elem)}},Viewport.prototype.exitFullscreen=function(){var exitFullScreen=this._getExitFullScreen();exitFullScreen&&exitFullScreen.call(document)},Viewport.prototype._getRequestFullScreen=function(elem){return elem.requestFullscreen?elem.requestFullscreen:elem.msRequestFullscreen?elem.msRequestFullscreen:elem.mozRequestFullScreen?elem.mozRequestFullScreen:!!elem.webkitRequestFullscreen&&elem.webkitRequestFullscreen},Viewport.prototype._getExitFullScreen=function(){return document.exitFullscreen?document.exitFullscreen:document.msExitFullscreen?document.msExitFullscreen:document.mozCancelFullScreen?document.mozCancelFullScreen:!!document.webkitExitFullscreen&&document.webkitExitFullscreen},Viewport.prototype._resize=function(){this._$element&&this._$viewport?(this._$element.width(this._getWidth()),this._$element.height(this._getHeight()),this._$viewport.width(this._getWidth()),this._$viewport.height(this._getHeight()),this._viewportCenter.x=this._$viewport.width()/2,this._viewportCenter.y=this._$viewport.height()/2,this._camera.aspect=this._$viewport.width()/this._$viewport.height(),this._camera.updateProjectionMatrix(),this._isVRMode?this._vrEffect.setSize(this._$viewport.width(),this._$viewport.height()):this._renderer.setSize(this._$viewport.width(),this._$viewport.height()),this._$loading.css({left:this._viewportCenter.x-this._$loading.width()/2,top:this._viewportCenter.y-this._$loading.height()/2})):this._$oldie&&this._$oldie.css({left:this._$element.width()/2-this._$oldie.outerWidth()/2,top:this._$element.height()/2-this._$oldie.outerHeight()/2})},Viewport}(_Components.BaseComponent);Virtex.Viewport=Viewport}(Virtex||(Virtex={}));var Virtex;!function(Virtex){var Events=function(){function Events(){}return Events.LOADED="loaded",Events}();Virtex.Events=Events}(Virtex||(Virtex={})),function(w){w.Virtex||(w.Virtex=Virtex)}(window)},{}]},{},[1])(1)});