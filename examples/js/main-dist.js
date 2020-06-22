/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

//import * as THREE from "three";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import Depthkit from "depthkit";

//Some general Three.js components
var renderer, scene, camera, controls;

//var depthkit;
//Depthkit character
var rotationStep = Math.PI / 9.0;
var positionStep = 0.05;

const appState = {
  characters: [],
  curCharacter: null,
  dephkits: [],
  curDephkit: null,
  curIndex: null,
};

const config = {
  paths: {
    assets: "../assets",
  },
  characters: [
    {
      name: "autumn",
      rotation: null,
      position: [2, 0.95, 0],
    },
    {
      name: "john",
      rotation: [Math.PI - 0.25, 0, Math.PI / -2.0],
      position: [-0.25, 0.92, 0],
    },
  ],
};

init();

function addHDR() {
  var path = "../assets/hdr/castle/";
  var format = ".jpg";
  var urls = [
    path + "px" + format,
    path + "nx" + format,
    path + "py" + format,
    path + "ny" + format,
    path + "pz" + format,
    path + "nz" + format,
  ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;

  var refractionCube = new THREE.CubeTextureLoader().load(urls);
  refractionCube.mapping = THREE.CubeRefractionMapping;
  refractionCube.format = THREE.RGBFormat;
  scene.background = reflectionCube;
}

function init() {
  //Setup renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true, //for transparent background
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Setup scene
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x282828); //for solid color bg
  scene.fog = new THREE.Fog(0x282828, 0.0, 10.0);

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );
  camera.position.set(0, 2, 3);
  // Setup controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.75, 0);
  camera.lookAt(controls.target);

  // A grid helper as a floor reference
  var gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);

  addHDR();

  config.characters.forEach((charInfo, index) => {
    const depthkit = new Depthkit();
    //if (index === 0) {
    console.log(charInfo.name);
    depthkit.load(
      // "../assets/John/John.txt",
      // "../assets/John/John.mp4",
      `${config.paths.assets}/${charInfo.name}/${charInfo.name}.txt`,
      `${config.paths.assets}/${charInfo.name}/${charInfo.name}.mp4`,
      (dkCharacter) => {
        const character = dkCharacter;

        //Position and rotation adjustments
        //dkCharacter.rotation.set(Math.PI - 0.25, 0, Math.PI / -2.0);
        // dkCharacter.rotation.y = Math.PI;
        //dkCharacter.position.set( -0.25, 0.92, 0 );
        if (charInfo.rotation) {
          dkCharacter.rotation.set(
            charInfo.rotation[0],
            charInfo.rotation[1],
            charInfo.rotation[2]
          );
        }

        if (charInfo.position) {
          dkCharacter.position.set(
            charInfo.position[0],
            charInfo.position[1],
            charInfo.position[2]
          );
        }

        //Add the character to the scene
        scene.add(dkCharacter);

        console.log("add character", charInfo.name);
        appState.characters.push(dkCharacter);
        appState.curCharacter = dkCharacter;
        appState.curIndex = index;
      }
    );
    // Depthkit video playback control
    depthkit.video.muted = "muted"; // Necessary for auto-play in chrome now
    depthkit.setLoop(true);
    depthkit.play();

    appState.dephkits.push(depthkit);
    appState.curDephkit = depthkit;
    //}
  });

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("keydown", onKeyDown, false);

  render();
}

function render() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  const character = appState.curCharacter;
  const dephkit = appState.curDephkit;
  switch (event.keyCode) {
    case 49: // key '1'
      depthkit.setMeshScalar(1);
      break;
    case 50: // key '2'
      depthkit.setMeshScalar(2);
      break;
    case 51: // key '3'
      depthkit.setMeshScalar(3);
      break;
    case 81: // key 'q'
      character.rotation.x += rotationStep;
      break;
    case 87: // key 'w'
      character.rotation.x -= rotationStep;
      break;
    case 65: // key 'a'
      character.rotation.y += rotationStep;
      break;
    case 83: // key 's'
      character.rotation.y -= rotationStep;
      break;
    case 90: // key 'z'
      character.rotation.z += rotationStep;
      break;
    case 88: // key 'x'
      character.rotation.z -= rotationStep;
      break;
    case 38: // key 'up arrow'
      character.position.y += positionStep;
      break;
    case 40: // key 'down arrow'
      character.position.y -= positionStep;
      break;
    case 37: // key 'left arrow'
      character.position.x -= positionStep;
      break;
    case 39: // key 'down arrow'
      character.position.x += positionStep;
      break;

    case 219: // key '['
      character.position.z -= positionStep;
      break;
    case 221: // key ']'
      character.position.z += positionStep;
      break;
    case 67: // key 'c'
      if (appState.curIndex < appState.characters.length - 1) {
        appState.curIndex++;
      } else {
        appState.curIndex = 0;
      }
      appState.curCharacter = appState.characters[appState.curIndex];
      appState.curDephkit = appState.dephkits[appState.curIndex];

    default:
      scene.updateMatrixWorld();

      var v = new THREE.Vector3();
      v.setFromMatrixPosition(appState.curCharacter.matrixWorld);
      console.log(v);
      break;
  }

  if (event.keyCode && appState.curCharacter) {
    console.log(appState.curCharacter.position, appState.curCharacter.rotation);
  }
}


/***/ })
/******/ ]);