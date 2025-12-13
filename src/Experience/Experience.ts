import * as THREE from "three";
import {Pane} from 'tweakpane';
import { Display } from "./Display";

export class Experience {
  pane: Pane;
  textureLoader: THREE.TextureLoader;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  appHTML: HTMLElement;
  display: Display;

  constructor() {
    // Pane
    this.pane = new Pane()

    // Texture loader
    this.textureLoader = new THREE.TextureLoader()

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      1,
      0.1,
      1000
    );
    this.camera.position.z = 1.07;
    this.pane.addBinding(this.camera.position, 'z', {min: 0, max: 10, step: 0.01, label: "cameraDistance"})

    // App
    this.appHTML = document.querySelector('#app') as HTMLElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias : true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(512, 512);
    this.appHTML.appendChild(this.renderer.domElement);

    // Display
    this.display = new Display(this.textureLoader, this.pane)
    this.scene.add(this.display.mesh)

    // Animate
    this.animate()
  }

  animate = () => {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate)
  }
}
