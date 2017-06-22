import { PerspectiveCamera } from 'three';

export class AppCamera extends PerspectiveCamera {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.position.set(25, 225, 25);
  }
}
