import { Object3D, Mesh, PlaneBufferGeometry, MeshBasicMaterial, AxisHelper } from 'three';
import { TilePrototype } from 'tilePrototype';
import { Tile } from 'tile';
import { MonsterPrototype } from 'monsterPrototype';
import { Monster } from 'monster';
import { CharacterPrototype } from 'characterPrototype';
import { Character } from 'character';
import { DungeonGenerator } from './generator/generator';

export class Dungeon {
  constructor(camera) {
    this.dataModel = {
      segmentCount: 20,
      segmentSize: 20,
      totalSize: 20 * 20
    };
    this.camera = camera;
    this.object = new Object3D();
    this.modules = [];
  }

  get fetch() {
    return new Promise((resolve, reject) => {
      resolve(this.generate());
    });
  }

  generate() {
    return this.load().then((objects) => {
      DEVELOPMENT && this.generateGrid();
      DEVELOPMENT && this.generateAxis();
      this.generateTiles(objects);
      this.generateMonsters(objects);
      this.generateCharacter(objects);
      return this.object;
    });
  }

  load() {
    let promises = [];
    promises.push(new TilePrototype().fetch);
    promises.push(new MonsterPrototype().fetch);
    promises.push(new CharacterPrototype().fetch);
    return Promise.all(promises);
  }

  generateGrid() {
    let grid = new Mesh(
      new PlaneBufferGeometry(
        this.dataModel.totalSize,
        this.dataModel.totalSize,
        this.dataModel.segmentCount,
        this.dataModel.segmentCount),
      new MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      })
    );
    grid.rotation.x = Math.PI * 0.5;

    this.object.add(grid);
  }

  generateAxis() {
    this.object.add(new AxisHelper(200));
  }

  getTilePrototype(type, prototypeArray) {
    return prototypeArray.find(item => item.name === type);
  }

  generateTiles(prototypes) {
    let tilePrototypes = prototypes.find(prototype => prototype.type === 'tile').prototypes;
    let layout = DungeonGenerator.generateLayout(this.dataModel.segmentCount);

    for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        let prototype = this.getTilePrototype(layout[i][j].type, tilePrototypes);
        let tile = new Tile(prototype, {
          position: {
            x: -(this.dataModel.totalSize / 2 - this.dataModel.segmentSize / 2) + this.dataModel.segmentSize * i,
            z: -(this.dataModel.totalSize / 2 - this.dataModel.segmentSize / 2) + this.dataModel.segmentSize * j
          }
        });

        this.modules.push(tile);
        this.object.add(tile.object);
      }
    }
  }

  generateMonsters(prototypes) {
    let monsterNumber = 5;
    let monsterPrototypes = prototypes.find(prototype => prototype.type === 'monster').prototypes;
    for (let i = 0; i < monsterNumber; i++) {
      let monster = new Monster(monsterPrototypes[0], {
        dungeon: this.object
      }); // TODO: other way
      this.modules.push(monster);
      this.object.add(monster.object);
    }
  }

  generateCharacter(prototypes) {
    let characterPrototypes = prototypes.find(prototype => prototype.type === 'character').prototypes;
    let character = new Character(characterPrototypes[0], {
      dungeon: this.object
    }, this.camera);
    this.modules.push(character);
    this.object.add(character.object);
  }

  update() {
    this.modules.forEach((module) => {
      if (module && module.update) {
        module.update();
      }
    });
  }
}
