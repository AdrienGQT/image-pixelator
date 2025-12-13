import * as THREE from "three";
import type { Pane } from "tweakpane";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export class Display {
  pane: Pane;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  baseImagePath: string = "/strawberry.png";
  baseImage: THREE.Texture;

  constructor(textureLoader: THREE.TextureLoader, pane: Pane) {
    this.pane = pane;

    this.baseImage = textureLoader.load(this.baseImagePath);

    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        baseImage: { value: this.baseImage },
        subdivisions: { value: 25 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    pane.addBinding(this.material.uniforms.subdivisions, 'value', {min: 2, max: 100, step: 1})

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}
