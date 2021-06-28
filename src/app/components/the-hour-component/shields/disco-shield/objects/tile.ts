import {
  Camera,
  Color,
  HSL,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Scene,
  WebGLRenderer,
} from 'three';
import moment, { Moment } from 'moment';

export class Tile extends Mesh {
  private nextColor: Color;
  private lastColorUpdate: Moment;
  private duration: number;

  constructor(geometry, material: Material | Material[], private transition) {
    super(geometry, material);
    this.duration = this.transition * 1000;
  }

  changeColor({ h, s, l }: HSL) {
    this.getMaterial().emissive.set(this.nextColor);
    this.nextColor = new Color().setHSL(h, s, l);
    this.lastColorUpdate = moment();
  }

  onBeforeRender = () => {
    const alpha =
      moment().diff(this.lastColorUpdate, 'millisecond') / this.duration;
    this.getMaterial().emissive.lerpHSL(this.nextColor, alpha);
  };

  private getMaterial(): MeshPhongMaterial {
    return this.material as MeshPhongMaterial;
  }
}
