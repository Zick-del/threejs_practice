import * as THREE from 'three';
// import { ColladaLoader } from '../js/ColladaLoader.js';
import { OrbitControls } from './OrbitControls.js';
import { OBJLoader } from './OBJLoader.js'

var container, clock, controls;
var camera, scene, renderer, mixer, animations, avatar;
var isPlayed = true;

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    if (mixer !== undefined) {
        mixer.update(delta);
    }
    renderer.render(scene, camera);
}

function loadScene() {

    container = document.getElementById('threejscontainer');
    if (!container) {
        return;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(15, 10, - 15);

    clock = new THREE.Clock();

    const loader = new OBJLoader();

    // load a resource
    loader.load(
        // resource URL
        './bw-office/source/Final_scene.obj',
        // called when resource is loaded
        function (object) {

            scene.add(object);

        },
        // called when loading is in progresses
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

    var gridHelper = new THREE.GridHelper(10, 20);
    scene.add(gridHelper);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    scene.add(camera);
    camera.add(pointLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.minDistance = 5;
    controls.maxDistance = 40;
    controls.target.set(0, 2, 0);
    controls.update();

    animate();
}

function onStart() {
    isPlayed = true;
}

function onStop() {
    isPlayed = false;
}

window.ThreeJSFunctions = {
    load: () => { loadScene(); },
    stop: () => { onStop(); },
    start: () => { onStart(); },
};

window.onload = loadScene;
