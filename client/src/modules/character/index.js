import { Box3 } from 'three';

export class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();
    this.object.position.y = 10;

    this.moveKey = {
      left: false,
      right: false,
      up: false,
      down: false
    };
    this.collisionList = [];

    this.object.add(camera);
    this.keyboardEvents();
    this.setPosition(param.dungeon);
    this.setCollisionList(param.dungeon);
  }

  keyboardEvents() {
    let onKeyDown = (event) => {
      switch (event.keyCode) {
        case 87: // w
          this.moveKey.up = true;
          break;
        case 65: // a
          this.moveKey.left = true;
          break;
        case 83: // s
          this.moveKey.down = true;
          break;
        case 68: // d
          this.moveKey.right = true;
          break;
      }
    };

    let onKeyUp = (event) => {
      Object.keys(this.moveKey).forEach((key) => {
        this.moveKey[key] = false;
      });
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

    this.object.position.x = start.x;
    this.object.position.z = start.z;
  }

  setCollisionList(dungeon) {
    if (!dungeon.children) {
      return;
    }

    let unavailableTiles = ['wall'];

    dungeon.children.forEach((children) => {
      if (unavailableTiles.indexOf(children.name) !== -1) {
        let boundingBox = new Box3().setFromObject(children);
        this.collisionList.push(boundingBox);
      }
    });
  }

  checkCollision() {
    let currentBoundingBox = new Box3().setFromObject(this.object);

    this.collisionList.forEach((item) => {
      let collision = item.intersectsBox(currentBoundingBox);

      if (collision) {
        console.log('DING');
        // this.move(true);
      }
    });
  }

  move(backPeddle) {
    if (backPeddle) {
      if (this.moveKey.up) {
        this.object.position.x += 1;
      }
      if (this.moveKey.down) {
        this.object.position.x -= 1;
      }
      if (this.moveKey.left) {
        this.object.position.z -= 1;
      }
      if (this.moveKey.right) {
        this.object.position.z += 1;
      }
    }
    if (this.moveKey.up) {
      this.object.position.x -= 1;
    }
    if (this.moveKey.down) {
      this.object.position.x += 1;
    }
    if (this.moveKey.left) {
      this.object.position.z += 1;
    }
    if (this.moveKey.right) {
      this.object.position.z -= 1;
    }
    // this.checkCollision();
  }

  update() {
    this.move();
  }
}
