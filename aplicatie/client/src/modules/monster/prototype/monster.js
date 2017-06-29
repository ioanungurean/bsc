import { Mesh, SphereBufferGeometry, MeshBasicMaterial, TextureLoader, DoubleSide } from 'three';

import '../resources/texture/crawler';

export class MonsterPrototype {
  constructor() {
    this.map = {
      assets: new Map()
    };

    this.prototypes = [];
  }

  get fetch() {
    return new Promise((resolve, reject) => {
      resolve(this.generate());
    });
  }

  generate() {
    return this.load().then((resources) => {
      this.map.assets.forEach((value, key) => {
        let prototype = new Mesh(
          value['geometry'],
          value['material']
        );
        prototype.name = key;
        prototype.position.y = 10;

        this.prototypes.push(prototype);
      });

      return {
        type: 'monster',
        prototypes: this.prototypes
      };
    });
  }

  load() {
    let loader = new TextureLoader();
    let assets = [{
      name: 'crawler',
      textureUrl: './resources/crawler.png'
    }];

    let promises = assets.map((asset) => {
      return new Promise((resolve, reject) => {
        loader.load(asset.textureUrl, (response) => {
          this.map.assets.set(asset.name, {
            geometry: new SphereBufferGeometry(9),
            material: new MeshBasicMaterial({ side: DoubleSide, map: response })
          });

          resolve(response);
        });
      });
    });

    return Promise.all(promises);
  }
}
