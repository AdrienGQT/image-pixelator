import * as THREE from "three";
import type { Pane } from "tweakpane";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export class Display {
  pane: Pane;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  baseImagePaths:string[] = ['/strawberry.png','/banana.png', 'apple.png']
  baseImageTextures: THREE.Texture[] = []
  currentImageTextureIndex: number = 0

  constructor(textureLoader: THREE.TextureLoader, pane: Pane) {
    this.pane = pane;

    this.baseImagePaths.forEach((path: string) => {
      this.baseImageTextures.push(textureLoader.load(path))
    })

    this.geometry = new THREE.PlaneGeometry(1, 1);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uBaseImage: { value: this.baseImageTextures[this.currentImageTextureIndex] },
        uSubdivisions: { value: 30 },
        uNoiseSize: { value: 5 },
        uNoiseTolerance: { value: 0.5 },
        uTime : { value : 0},
        uTimeSpeed : {value : 1}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });

    pane.addBinding(this.material.uniforms.uSubdivisions, "value", {
      min: 5,
      max: 100,
      step: 1,
      label: "subdivisions",
    });
    pane.addBinding(this.material.uniforms.uNoiseSize, "value", {
      min: 1,
      max: 10,
      step: 0.1,
      label: "noiseSize",
    });
    pane.addBinding(this.material.uniforms.uNoiseTolerance, "value", {
      min: 0.0,
      max: 1,
      step: 0.001,
      label: "noiseTolerance",
    });
    pane.addBinding(this.material.uniforms.uTimeSpeed, "value", {
      min: 0.0,
      max: 15,
      step: 0.01,
      label: "timeSpeed",
    });

    const nextTextureButton = pane.addButton({
      title: 'Next image',
      label: 'texture'
    })
    nextTextureButton.on('click', () => {
      this.currentImageTextureIndex = (this.currentImageTextureIndex + 1) % this.baseImageTextures.length
      this.material.uniforms.uBaseImage.value = this.baseImageTextures[this.currentImageTextureIndex]
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}
