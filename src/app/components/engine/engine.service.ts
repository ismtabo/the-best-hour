import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { TheHourComponentComponent } from '../the-hour-component/the-hour-component.component';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  protected canvas: HTMLCanvasElement;
  protected renderer: THREE.WebGLRenderer;
  protected camera: THREE.PerspectiveCamera;
  protected scene: THREE.Scene;
  protected light: THREE.AmbientLight;
  protected manager: THREE.LoadingManager;
  protected clock = new THREE.Clock();
  protected delta = 0;
  // 30 fps
  protected interval = 1 / 30;

  protected cube: THREE.Mesh;

  protected frameId: number = null;

  public constructor(protected ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

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

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.update();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.update();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public update(): void {
    this.frameId = requestAnimationFrame(() => {
      this.update();
    });
    this.delta += this.clock.getDelta();

    if (this.delta > this.interval) {
      // The draw or time dependent code are here
      this.render();

      this.delta = this.delta % this.interval;
    }
  }

  public render(): void {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
