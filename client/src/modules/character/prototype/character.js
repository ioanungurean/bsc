import { Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';

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
      let boxCharacter = new Mesh(
        new BoxBufferGeometry(10, 20, 10),
        new MeshBasicMaterial({ color: 0xfff222 })
      );
      boxCharacter.name = 'box';
      this.prototypes.push(boxCharacter);

      return {
        type: 'character',
        prototypes: this.prototypes
      };
    });
  }

  load() {
    let promises = [];
    return Promise.all(promises);
  }
}
