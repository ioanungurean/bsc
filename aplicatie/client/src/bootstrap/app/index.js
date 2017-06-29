import { Scene } from 'three';

import { AppCamera } from './core/camera';
import { AppRenderer } from './core/renderer';

import { Dungeon } from 'dungeon';

let OrbitControls = require('three-orbitcontrols');

export class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new AppRenderer();
    this.camera = new AppCamera();

    this.modules = []; // children modules i.e dungeon
  }

  /**
   *
   */
  run() {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 10000;

    this.load().then((modules) => {
      modules.forEach((object) => {
        this.scene.add(object);
      });
      this.loop();
    });
  }

  /**
   *
   */
  loop() {
    let renderLoop = () => {
      requestAnimationFrame(renderLoop);
      this.renderer.render(this.scene, this.camera);
      this.update();
    };
    renderLoop();
  }

  /**
   *
   */
  load() {
    this.modules.push(new Dungeon(this.camera)); // TODO: other way to access camera maybe

    let promises = this.modules.map((module) => {
      return module.fetch;
    });
    return Promise.all(promises);
  }

  /**
   *
   */
  update() {
    this.modules.forEach((module) => {
      if (module && module.update) {
        module.update();
      }
    });
  }
}
