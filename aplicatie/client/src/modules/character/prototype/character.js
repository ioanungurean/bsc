import { ObjectLoader } from 'three';

import '../resources/rabbit.json';
import '../resources/rabbit.png';

export class CharacterPrototype {
  constructor() {
    this.prototypes = [];
  }

  get fetch() {
    return new Promise((resolve, reject) => {
      resolve(this.generate());
    });
  }

  generate() {
    return this.load().then((resources) => {
      resources.scale.set(5, 5, 5);
      resources.name = 'rabbit';
      this.prototypes.push(resources);

      return {
        type: 'character',
        prototypes: this.prototypes
      };
    });
  }

  load() {
    let loader = new ObjectLoader();
    return new Promise ((resolve, reject) => {
      loader.load('./resources/rabbit.json', (resources) => {
        resolve(resources);
      });
    });
  }
}
