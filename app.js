webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_layout__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_layout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_layout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app__ = __webpack_require__(7);


/**
 * Bootstrap the App
 */
((callback) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
})(() => {
  let app = new __WEBPACK_IMPORTED_MODULE_1_app__["a" /* App */]();
  app.run();
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);


class AppCamera extends __WEBPACK_IMPORTED_MODULE_0_three__["PerspectiveCamera"] {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.position.set(0, 20, 30);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AppCamera;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);


class AppRenderer extends __WEBPACK_IMPORTED_MODULE_0_three__["WebGLRenderer"] {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = AppRenderer;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_camera__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_renderer__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dungeon__ = __webpack_require__(11);







let OrbitControls = __webpack_require__(25);

class App {
  constructor() {
    this.scene = new __WEBPACK_IMPORTED_MODULE_0_three__["Scene"]();

    this.scene.fog = new __WEBPACK_IMPORTED_MODULE_0_three__["Fog"](0xcce0ff, 100, 300);
    this.renderer = new __WEBPACK_IMPORTED_MODULE_2__core_renderer__["a" /* AppRenderer */](this.scene.fog.color);

    this.camera = new __WEBPACK_IMPORTED_MODULE_1__core_camera__["a" /* AppCamera */]();

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
    this.modules.push(new __WEBPACK_IMPORTED_MODULE_3_dungeon__["a" /* Dungeon */](this.camera)); // TODO: other way to access camera maybe

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
/* harmony export (immutable) */ __webpack_exports__["a"] = App;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);


class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();

    this.keyboard = {};
    this.collisionList = [];

    this.moveSpeed = 0.9;
    this.rotateSpeed = Math.PI * 0.01;

    this.object.add(camera);
    this.keyboardEvents();
    this.setPosition(param.dungeon);
    this.setCollisionList(param.dungeon);
  }

  keyboardEvents() {
    let onKeyDown = (event) => {
      event.preventDefault();
      this.keyboard[event.code] = true;
    };

    let onKeyUp = (event) => {
      event.preventDefault();
      this.keyboard[event.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  setPosition(dungeon) {
    if (!dungeon.children) {
      return;
    }
    let start = {};

    dungeon.children.forEach((children) => {
      if (children.name === 'spawn') {
        start.x = children.position.x;
        start.z = children.position.z;
      }
    });

    this.object.position.y = 10;
    this.object.position.x = start.x;
    this.object.position.z = start.z;
    this.object.rotation.y = Math.PI / 2;
  }

  setCollisionList(dungeon) {
    if (!dungeon.children) {
      return;
    }

    let unavailableTiles = ['wall'];

    dungeon.children.forEach((children) => {
      if (unavailableTiles.indexOf(children.name) !== -1) {
        let boundingBox = new __WEBPACK_IMPORTED_MODULE_0_three__["Box3"]().setFromObject(children);
        this.collisionList.push(boundingBox);
      }
    });
  }

  checkCollision() {
    let currentBoundingBox = new __WEBPACK_IMPORTED_MODULE_0_three__["Box3"]().setFromObject(this.object);

    this.collisionList.forEach((item) => {
      let collision = item.intersectsBox(currentBoundingBox);

      if (collision) {
        this.move(true);
      }
    });
  }

  move(backPeddle) {
    if (backPeddle) {
      if (this.keyboard.KeyA) { // a
        this.object.rotation.y += this.rotateSpeed;
      }
      if (this.keyboard.KeyD) { // d
        this.object.rotation.y -= this.rotateSpeed;
      }
      if (this.keyboard.KeyS) { // s
        this.object.translateZ(-this.moveSpeed);
      }
      if (this.keyboard.KeyW) { // w
        this.object.translateZ(this.moveSpeed);
      }
    } else {
      if (this.keyboard.KeyA) { // a
        this.object.rotation.y -= this.rotateSpeed;
      }
      if (this.keyboard.KeyD) { // d
        this.object.rotation.y += this.rotateSpeed;
      }
      if (this.keyboard.KeyS) { // s
        this.object.translateZ(this.moveSpeed);
      }
      if (this.keyboard.KeyW) { // w
        this.object.translateZ(-this.moveSpeed);
      }
    }
    this.checkCollision();
  }

  update() {
    this.move();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Character;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);


class CharacterPrototype {
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
      let boxCharacter = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](
        new __WEBPACK_IMPORTED_MODULE_0_three__["BoxBufferGeometry"](5, 10, 5),
        new __WEBPACK_IMPORTED_MODULE_0_three__["MeshBasicMaterial"]({ color: 0xfff222 })
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
/* harmony export (immutable) */ __webpack_exports__["a"] = CharacterPrototype;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DungeonGenerator {
  /**
   * @description Generates the dungeon
   */
  static generateLayout(size) {
    let dungeonLayout = DungeonGenerator.generateCleanLayout(size, {
      type: 'ground'
    });
    DungeonGenerator.generateRandomRooms(size, dungeonLayout, 'wall');
    DungeonGenerator.generateBorderWalls(size, dungeonLayout);
    DungeonGenerator.generateSpectrumPoints(size, dungeonLayout);
    return dungeonLayout;
  }
  /**
   * @description Generates random number
   */
  static generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * @description Generates starting point of room
   */
  static generateRoomPosition(size) {
    return {
      x: DungeonGenerator.generateRandomNumber(1, size),
      y: DungeonGenerator.generateRandomNumber(1, size)
    };
  }

  /**
   * @description Generates a random room size
   */
  static generateRoomSize(size) {
    let minRoomSize = 2;
    let maxRoomSize = size / 4;

    return {
      width: DungeonGenerator.generateRandomNumber(minRoomSize, maxRoomSize),
      height: DungeonGenerator.generateRandomNumber(minRoomSize, maxRoomSize)
    };
  }

  /**
   * @description Creates a clean layout
   */
  static generateCleanLayout(size, tile) {
    return Array.from({
      length: size
    }, () => {
      return Array.from({
        length: size
      }, () => tile);
    });
  }

  /**
   * @description Check to see if rooms overlap
   */
  static checkRoomOverlap(size, layout, position, dimension, type) {
    let isOverlapped = false;

    if (position.x + dimension.width >= size || position.y + dimension.height >= size) {
      isOverlapped = true;
      return isOverlapped;
    }

    if (layout[position.x][position.y].type === type) {
      isOverlapped = true;
      return isOverlapped;
    }

    for (let i = position.x - 1; i < position.x + dimension.width + 1; i++) {
      for (let j = position.y - 1; j < position.y + dimension.height + 1; j++) {
        if (layout[i][j].type === type) {
          isOverlapped = true;
        }
      }
    }

    return isOverlapped;
  }

  /**
   * @description Place random rooms across the dungeon
   */
  static generateRandomRooms(size, layout, type) {
    let nrAttempts = 1000;

    for (let i = 0; i < nrAttempts; i++) {
      let roomSize = DungeonGenerator.generateRoomSize(size);
      let roomPosition = DungeonGenerator.generateRoomPosition(size);

      if (!DungeonGenerator.checkRoomOverlap(size, layout, roomPosition, roomSize, type)) {
        for (let j = roomPosition.x; j < roomPosition.x + roomSize.width; j++) {
          for (let k = roomPosition.y; k < roomPosition.y + roomSize.height; k++) {
            layout[j][k] = {
              type: type
            };
          }
        }
      }
    }
  }

  /**
   * @description We build the walls that surround the dungeon
   */
  static generateBorderWalls(size, layout) {
    for (let i = 0; i < size; i++) {
      layout[0][i] = { type: 'wall' };
      layout[size - 1][i] = { type: 'wall' };
      layout[i][0] = { type: 'wall' };
      layout[i][size - 1] = { type: 'wall' };
    }
  }

  /**
   * @description Place destination & starting spawn points
   */
  static generateSpectrumPoints(size, layout) {
    layout[size - 1][10] = {
      type: 'spawn'
    };
    layout[0][DungeonGenerator.generateRandomNumber(1, size - 1)] = {
      type: 'exit'
    };
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DungeonGenerator;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tilePrototype__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tile__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_monsterPrototype__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_monster__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_characterPrototype__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_character__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__generator_generator__ = __webpack_require__(10);









class Dungeon {
  constructor(camera) {
    this.dataModel = {
      segmentCount: 20,
      segmentSize: 20,
      totalSize: 20 * 20
    };
    this.camera = camera;
    this.object = new __WEBPACK_IMPORTED_MODULE_0_three__["Object3D"]();
    this.modules = [];
  }

  get fetch() {
    return new Promise((resolve, reject) => {
      resolve(this.generate());
    });
  }

  generate() {
    return this.load().then((objects) => {
      // DEVELOPMENT && this.generateGrid();
      // DEVELOPMENT && this.generateAxis();
      this.generateTiles(objects);
      this.generateMonsters(objects);
      this.generateCharacter(objects);
      return this.object;
    });
  }

  load() {
    let promises = [];
    promises.push(new __WEBPACK_IMPORTED_MODULE_1_tilePrototype__["a" /* TilePrototype */]().fetch);
    promises.push(new __WEBPACK_IMPORTED_MODULE_3_monsterPrototype__["a" /* MonsterPrototype */]().fetch);
    promises.push(new __WEBPACK_IMPORTED_MODULE_5_characterPrototype__["a" /* CharacterPrototype */]().fetch);
    return Promise.all(promises);
  }

  generateGrid() {
    let grid = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](
      new __WEBPACK_IMPORTED_MODULE_0_three__["PlaneBufferGeometry"](
        this.dataModel.totalSize,
        this.dataModel.totalSize,
        this.dataModel.segmentCount,
        this.dataModel.segmentCount),
      new __WEBPACK_IMPORTED_MODULE_0_three__["MeshBasicMaterial"]({
        color: 0xffff00,
        wireframe: true
      })
    );

    this.object.add(grid);
  }

  generateAxis() {
    this.object.add(new __WEBPACK_IMPORTED_MODULE_0_three__["AxisHelper"](200));
  }

  getTilePrototype(type, prototypeArray) {
    return prototypeArray.find(item => item.name === type);
  }

  generateTiles(prototypes) {
    let tilePrototypes = prototypes.find(prototype => prototype.type === 'tile').prototypes;
    let layout = __WEBPACK_IMPORTED_MODULE_7__generator_generator__["a" /* DungeonGenerator */].generateLayout(this.dataModel.segmentCount);

    for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        let prototype = this.getTilePrototype(layout[i][j].type, tilePrototypes);
        let tile = new __WEBPACK_IMPORTED_MODULE_2_tile__["a" /* Tile */](prototype, {
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
      let monster = new __WEBPACK_IMPORTED_MODULE_4_monster__["a" /* Monster */](monsterPrototypes[0], {
        dungeon: this.object
      }); // TODO: other way
      this.modules.push(monster);
      this.object.add(monster.object);
    }
  }

  generateCharacter(prototypes) {
    let characterPrototypes = prototypes.find(prototype => prototype.type === 'character').prototypes;
    let character = new __WEBPACK_IMPORTED_MODULE_6_character__["a" /* Character */](characterPrototypes[0], {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Dungeon;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);


class Monster {
  constructor(prototype, param) {
    this.object = prototype.clone();

    this.currentDirection = 'N';
    this.directionList = ['N', 'S', 'W', 'E'];
    this.collisionList = [];
    this.moveSpeed = 0.9;
    this.isWalking = true;
    this.setPosition(param.dungeon);
    this.setCollisionList(param.dungeon);
  }

  /**
   * @description sets the monster position on available tiles
   */
  setPosition(dungeon) {
    if (!dungeon.children) {
      console.warn('Set Position - No children for dungeon'); return;
    }
    let availablePositions = [];

    dungeon.children.forEach((children) => { // we get all available positions
      if (children.name === 'ground') {
        availablePositions.push({
          x: children.position.x,
          z: children.position.z
        })
      }
    });

    let random = Math.floor(Math.random() * availablePositions.length); // we chose one random position
    this.object.position.x = availablePositions[random].x;
    this.object.position.z = availablePositions[random].z;
  }

  /**
   * @description populates the list with collidable items
   */
  setCollisionList(dungeon) {
    if (!dungeon.children) {
      console.warn('Set Collision List - No children for dungeon'); return;
    }

    let unavailableTiles = ['wall', 'exit', 'spawn'];
    // BUG: some monsters fly off the map at spawn point :)
    dungeon.children.forEach((children) => {
      if (unavailableTiles.indexOf(children.name) !== -1) {
        let boundingBox = new __WEBPACK_IMPORTED_MODULE_0_three__["Box3"]().setFromObject(children);
        this.collisionList.push(boundingBox);
      }
    });
  }

  chooseAvailableDirection() {
    this.directionList = this.directionList.filter((direction) => {
      return direction !== this.currentDirection;
    });
    this.currentDirection = this.directionList[Math.floor(Math.random() * this.directionList.length)];
  }

  checkCollision() {
    let currentBoundingBox = new __WEBPACK_IMPORTED_MODULE_0_three__["Box3"]().setFromObject(this.object);

    this.isWalking = true;
    this.collisionList.forEach((item) => {
      let collision = item.intersectsBox(currentBoundingBox);

      if (collision) {
        this.isWalking = false;
      }
    });

    if (!this.isWalking) { // make sure we step back only once
      this.step(true);
    } else { // if our next step is ok, we reset directions
      this.directionList = ['N', 'S', 'W', 'E'];
    }
  }

  step(backwards) {
    switch (this.currentDirection) {
      case 'N':
        if (backwards) {
          this.object.position.x -= this.moveSpeed;
        } else { // normal walk
          this.object.position.x += this.moveSpeed;
        }
        break;
      case 'S':
        if (backwards) {
          this.object.position.x += this.moveSpeed;
        } else { // normal walk
          this.object.position.x -= this.moveSpeed;
        }
        break;
      case 'W':
        if (backwards) {
          this.object.position.z -= this.moveSpeed;
        } else { // normal walk
          this.object.position.z += this.moveSpeed;
        }
        break;
      case 'E':
        if (backwards) {
          this.object.position.z += this.moveSpeed;
        } else { // normal walk
          this.object.position.z -= this.moveSpeed;
        }
        break;
    }
    if (backwards) {
      this.chooseAvailableDirection();
    } else {
      this.checkCollision();
    }
  }

  move() {
    this.step();
  }

  update() {
    this.move();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Monster;


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)))

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_texture_crawler__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_texture_crawler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__resources_texture_crawler__);




class MonsterPrototype {
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
        let prototype = new __WEBPACK_IMPORTED_MODULE_0_three__["Mesh"](
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
    let loader = new __WEBPACK_IMPORTED_MODULE_0_three__["TextureLoader"]();
    let assets = [{
      name: 'crawler',
      textureUrl: './resources/crawler.png'
    }];

    let promises = assets.map((asset) => {
      return new Promise((resolve, reject) => {
        loader.load(asset.textureUrl, (response) => {
          this.map.assets.set(asset.name, {
            geometry: new __WEBPACK_IMPORTED_MODULE_0_three__["SphereBufferGeometry"](8),
            material: new __WEBPACK_IMPORTED_MODULE_0_three__["MeshBasicMaterial"]({ side: __WEBPACK_IMPORTED_MODULE_0_three__["DoubleSide"], map: response })
          });

          resolve(response);
        });
      });
    });

    return Promise.all(promises);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MonsterPrototype;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Tile {
  constructor(prototype, param) {
    this.object = prototype.clone();
    this.object.position.x = param.position.x;
    this.object.position.z = param.position.z;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tile;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources_texture_ground__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources_texture_ground___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__resources_texture_ground__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_texture_wall__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_texture_wall___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__resources_texture_wall__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__resources_texture_start__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__resources_texture_start___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__resources_texture_start__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__resources_texture_finish__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__resources_texture_finish___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__resources_texture_finish__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_three__ = __webpack_require__(0);







class TilePrototype {
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
        let prototype = new __WEBPACK_IMPORTED_MODULE_4_three__["Mesh"](
          value['geometry'],
          value['material']
        );
        prototype.name = key;
        if (key === 'wall') {
          prototype.position.y = this.size / 2;
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
        return new __WEBPACK_IMPORTED_MODULE_4_three__["PlaneBufferGeometry"](size, size, 1, 1);
      case 'box':
        return new __WEBPACK_IMPORTED_MODULE_4_three__["BoxBufferGeometry"](size, size, size);
    }
  }

  load() {
    let loader = new __WEBPACK_IMPORTED_MODULE_4_three__["TextureLoader"]();
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
      textureUrl: './resources/start.png',
      geometry: 'plane'
    },{
      name: 'exit',
      textureUrl: './resources/finish.png',
      geometry: 'plane'
    }];

    let promises = assets.map((asset) => {
      return new Promise((resolve, reject) => {
        loader.load(asset.textureUrl, (response) => {
          this.map.assets.set(asset.name, {
            geometry: this.resolveGeometry(asset.geometry, this.size),
            material: new __WEBPACK_IMPORTED_MODULE_4_three__["MeshBasicMaterial"]({ side: __WEBPACK_IMPORTED_MODULE_4_three__["DoubleSide"], map: response})
          });

          resolve(response);
        });
      });
    });

    return Promise.all(promises);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TilePrototype;



/***/ }),
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "resources/crawler.png";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "resources/finish.png";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "resources/ground.png";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "resources/start.png";

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "resources/wall.png";

/***/ }),
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ })
],[28]);