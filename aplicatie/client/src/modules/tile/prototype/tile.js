import '../resources/texture/ground';
import '../resources/texture/wall';
import '../resources/texture/circle_a';
import '../resources/texture/circle_b';

import { Mesh, PlaneBufferGeometry, BoxBufferGeometry, MeshBasicMaterial, TextureLoader, DoubleSide } from 'three';

export class TilePrototype {
  constructor(param) {
    this.map = {
      assets: new Map()
    };
    this.size = 20;
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
        if (key === 'wall') {
          prototype.position.y = this.size;
        } else {
          prototype.rotation.x = Math.PI * 0.5;
        }

        this.prototypes.push(prototype);
      });

      return {
        type: 'tile',
        prototypes: this.prototypes
      };
    });
  }

  resolveGeometry(type, size) {
    switch (type) {
      case 'plane':
        return new PlaneBufferGeometry(size, size, 1, 1);
      case 'box':
        return new BoxBufferGeometry(size, size * 2, size);
    }
  }

  load() {
    let loader = new TextureLoader();
    let assets = [{
      name: 'ground',
      textureUrl: './resources/ground.png',
      geometry: 'plane'
    },{
      name: 'wall',
      textureUrl: './resources/wall.png',
      geometry: 'box'
    },{
      name: 'spawn',
      textureUrl: './resources/circle_a.png',
      geometry: 'plane'
    },{
      name: 'exit',
      textureUrl: './resources/circle_b.png',
      geometry: 'plane'
    }];

    let promises = assets.map((asset) => {
      return new Promise((resolve, reject) => {
        loader.load(asset.textureUrl, (response) => {
          this.map.assets.set(asset.name, {
            geometry: this.resolveGeometry(asset.geometry, this.size),
            material: new MeshBasicMaterial({ side: DoubleSide, map: response})
          });

          resolve(response);
        });
      });
    });

    return Promise.all(promises);
  }
}
