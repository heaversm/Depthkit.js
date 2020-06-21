//Some general Three.js components
var renderer, scene, camera, controls;

var depthkit;
//Depthkit character
var character;
var rotationStep = Math.PI / 9.0;
var positionStep = 0.05;

const appState = {
  character: "autumn",
};

const config = {
  paths: {
    assets: "../../assets",
  },
  characters: {
    autumn: {
      name: "autumn",
      rotation: null,
      position: [0, 0.95, 0],
    },
    john: {
      name: "john",
      rotation: [Math.PI - 0.25, 0, Math.PI / -2.0],
      position: [-0.25, 0.92, 0],
    },
  },
};

init();

function init() {
  //Setup renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x282828);
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
  controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 0.75, 0);
  camera.lookAt(controls.target);

  // A grid helper as a floor reference
  var gridHelper = new THREE.GridHelper(50, 50);
  scene.add(gridHelper);

  const charInfo = config.characters[appState.character];

  depthkit = new Depthkit();
  depthkit.load(
    // "../assets/John/John.txt",
    // "../assets/John/John.mp4",
    `${config.paths.assets}/${charInfo.name}/${charInfo.name}.txt`,
    `${config.paths.assets}/${charInfo.name}/${charInfo.name}.mp4`,
    (dkCharacter) => {
      character = dkCharacter;

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

      // Depthkit video playback control
      depthkit.video.muted = "muted"; // Necessary for auto-play in chrome now
      depthkit.setLoop(true);
      depthkit.play();

      //Add the character to the scene
      scene.add(character);
    }
  );

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

    default:
      scene.updateMatrixWorld();

      var v = new THREE.Vector3();
      v.setFromMatrixPosition(character.matrixWorld);
      console.log(v);
      break;
  }

  if (event.keyCode && character) {
    console.log(character.position, character.rotation);
  }
}
