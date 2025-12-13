import * as THREE from "three";
import { Pane } from "tweakpane";
import { Display } from "./Display";

interface DebugObject {
  clearColor: string;
}

export class Experience {
  pane: Pane;
  textureLoader: THREE.TextureLoader;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  appHTML: HTMLElement;
  display: Display;
  clock: THREE.Clock;
  debugObject: DebugObject = {
    clearColor: '#f4ecd9'
  };


  constructor() {
    // Pane
    this.pane = new Pane();

    // Texture loader
    this.textureLoader = new THREE.TextureLoader();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    if (window.innerWidth / window.innerHeight < 1) {
      this.camera.position.z = 2.2;
    } else {
      this.camera.position.z = 1.5;
    }

    this.pane.addBinding(this.camera.position, "z", {
      min: 0,
      max: 10,
      step: 0.01,
      label: "cameraDistance",
    });

    // App
    this.appHTML = document.querySelector("#app") as HTMLElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.appHTML.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(this.debugObject.clearColor);

    this.pane.addBinding(this.debugObject, "clearColor").on("change", () => {
      this.renderer.setClearColor(this.debugObject.clearColor);
    });

    // Display
    this.display = new Display(this.textureLoader, this.pane);
    this.scene.add(this.display.mesh);

    // On resize
    window.addEventListener("resize", this.handleResize);

    // Animate
    this.clock = new THREE.Clock();
    this.animate();
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  animate = () => {
    const elapsedTime = this.clock.getElapsedTime();

    this.renderer.render(this.scene, this.camera);

    this.display.material.uniforms.uTime.value = elapsedTime;

    requestAnimationFrame(this.animate);
  };
}
