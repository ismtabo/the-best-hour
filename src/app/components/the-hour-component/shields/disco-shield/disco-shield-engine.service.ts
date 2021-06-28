import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Tile } from './objects/tile';
import moment, { Moment } from 'moment';
import { EngineService } from 'src/app/components/engine/engine.service';
import {
  HSL,
  Group,
  MeshPhongMaterial,
  WebGLRenderer,
  BoxGeometry,
  Color,
  LoadingManager,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  Clock,
  Vector2,
  Vector3,
} from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class DiscoShieldEngineService
  extends EngineService
  implements OnDestroy
{
  private discoBall: Group;
  private floor: Tile[];
  private cubeMaterial: MeshPhongMaterial;
  private colors: HSL[] = [];
  private nextColorIndex: number;
  private transition = 2;
  private duration = this.transition * 1000;
  private intervalId: number;

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true, // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 75;
    this.scene.add(this.camera);

    // soft white light
    // const ambientLight = new AmbientLight(0xcccccc, 0.4);
    // this.scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);

    // add models
    // model
    this.manager = new LoadingManager();
    this.loadDiscoModel();

    this.nextColorIndex = 0;
    this.colors = this.generateColors(50, 100, 10);

    const rows = 5;
    const columns = 5;
    const tileWidth = 100 / columns;
    const tileHeight = 1;
    const tileDepth = 100 / rows;
    const origin = new Vector3().set(
      -tileWidth * Math.floor(rows / 2),
      -40,
      -20
    );
    const floor = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const geometry = new BoxGeometry(tileWidth, tileHeight, tileDepth);
        const tile = new Tile(
          geometry,
          new MeshPhongMaterial({
            emissiveIntensity: 1,
            reflectivity: 0.3,
            shininess: 150,
          }),
          this.transition
        );
        tile.position.add(origin);
        tile.translateX(tileWidth * column);
        tile.translateZ(-tileDepth * row);
        const colorIdx = column + row;
        const color = this.colors[colorIdx % this.colors.length];
        tile.changeColor(color);
        floor.push(tile);
        this.scene.add(tile);
      }
    }
    this.floor = floor;
    this.intervalId = setInterval(() => {
      this.nextColorIndex++;
      if (this.nextColorIndex >= this.colors.length) {
        this.nextColorIndex = 0;
      }
      this.floor.forEach((tile, i) => {
        const row = Math.floor(i / rows);
        const column = i % columns;
        const colorIdx = this.nextColorIndex + row + column;
        const color = this.colors[colorIdx % this.colors.length];
        tile.changeColor(color);
      });
    }, this.duration);
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

  async loadModel(materials): Promise<Group> {
    return new Promise((resolve, reject) => {
      new OBJLoader(this.manager)
        .setMaterials(materials)
        .setPath('assets/models/')
        .load('MirrorBall.obj', resolve, this.progress, reject);
    });
  }

  progress(xhr) {
    if (xhr.lengthComputable && !environment.production) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(percentComplete.toFixed(2) + '% downloaded');
    }
  }

  generateColors(saturation, lightness, amount): HSL[] {
    let colors: HSL[] = [];
    let huedelta = Math.trunc(360 / amount);
    for (let i = 0; i < amount; i++) {
      let hue = i * huedelta;
      colors.push({ h: hue / 255, s: saturation / 255, l: lightness / 255 });
    }
    return colors;
  }

  pickRandomColor(): HSL {
    const rndIdx = Math.floor(Math.random() * this.colors.length);
    return this.colors[rndIdx];
  }

  public render(): void {
    if (this.discoBall != null) this.discoBall.rotation.y -= 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
