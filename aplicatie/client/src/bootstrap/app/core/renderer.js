import { WebGLRenderer } from 'three';

export class AppRenderer extends WebGLRenderer {
  constructor(fogColor) {
    super({
      antialias: true,
      canvas: document.querySelector('#app')
    });
    this.setClearColor(fogColor);
    this.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
      this.setSize(window.innerWidth, window.innerHeight);
    }, false);
  }
}
