import { PerspectiveCamera } from 'three';

export class AppCamera extends PerspectiveCamera {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.position.set(0, 20, 30);
  }
}
