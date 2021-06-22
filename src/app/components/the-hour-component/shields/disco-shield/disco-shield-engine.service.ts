import { ElementRef, Injectable } from '@angular/core';
import { EngineService } from 'src/app/components/engine/engine.service';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable()
export class DiscoShieldEngineService extends EngineService {
  private discoBall: THREE.Group;
  private cubeMaterial: THREE.MeshPhongMaterial;
  private colors: THREE.HSL[] = [];

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    this.camera.position.z = 75;
    this.scene.add(this.camera);

    // soft white light
    // const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    // this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);

    // add models
    // model
    this.manager = new THREE.LoadingManager();
    this.loadDiscoModel();

    this.colors = this.generateColors(50, 100, 9);

    const geometry = new THREE.BoxGeometry(100, 1, 100);
    this.cubeMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 1,
      reflectivity: 0.3,
      shininess: 150,
    });
    this.cube = new THREE.Mesh(geometry, this.cubeMaterial);
    this.cube.position.y = -40;
    this.cube.position.z = -20;
    setInterval(() => {
      const { h, s, l } = this.pickRandomColor();
      const color = new THREE.Color();
      color.setHSL(h, s, l);
      this.cubeMaterial.emissive.lerpHSL(color, 1);
    }, 1000);
    this.scene.add(this.cube);
  }

  async loadDiscoModel() {
    const materials = await this.loadTexture();
    materials.preload();
    const object = await this.loadModel(materials);
    this.discoBall = object;
    object.position.y = 30;
    object.position.z = -20;
    this.scene.add(object);
  }

  async loadTexture(): Promise<MTLLoader.MaterialCreator> {
    return new Promise((resolve, reject) => {
      new MTLLoader(this.manager)
        .setPath('assets/models/')
        .load('MirrorBall.mtl', resolve, this.progress, reject);
    });
  }

  async loadModel(materials): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      new OBJLoader(this.manager)
        .setMaterials(materials)
        .setPath('assets/models/')
        .load('MirrorBall.obj', resolve, this.progress, reject);
    });
  }

  progress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(percentComplete.toFixed(2) + '% downloaded');
    }
  }

  generateColors(saturation, lightness, amount): THREE.HSL[] {
    let colors: THREE.HSL[] = [];
    let huedelta = Math.trunc(360 / amount);
    for (let i = 0; i < amount; i++) {
      let hue = i * huedelta;
      colors.push({ h: hue / 255, s: saturation / 255, l: lightness / 255 });
    }
    return colors;
  }

  pickRandomColor(): THREE.HSL {
    const rndIdx = Math.floor(Math.random() * this.colors.length);
    return this.colors[rndIdx];
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    if (this.discoBall != null) this.discoBall.rotation.y -= 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}
