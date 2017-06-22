import { Box3 } from 'three';

export class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();
    this.object.position.y = 10;

    this.moveKey = {
      up: false,
      left: false,
      down: false,
      right: false
    };
    this.collisionList = [];

    this.object.add(camera);
    this.keyboardEvents();
    this.setPosition(param.dungeon);
    this.setCollisionList(param.dungeon);
  }

  keyboardEvents() {
    let fired = {
      up: false,
      left: false,
      down: false,
      right: false
    };

    let onKeyDown = (event) => {
      switch (event.keyCode) {
        case 87: // w
          if (!fired.up) {
            fired.up = true;
            this.moveKey.up = true;
            console.log('up', this.moveKey.up);
          }
          break;
        case 65: // a
          if (!fired.left) {
            fired.left = true;
            this.moveKey.left = true;
            console.log('left', this.moveKey.left);
          }
          break;
        case 83: // s
          if (!fired.down) {
            fired.down = true;
            this.moveKey.down = true;
            console.log('down', this.moveKey.down);
          }
          break;
        case 68: // d
          if (!fired.right) {
            fired.right = true;
            this.moveKey.right = true;
            console.log('right', this.moveKey.right);
          }
          break;
      }
    };

    let onKeyUp = (event) => {
      switch (event.keyCode) {
        case 87: // w
          if (fired.up) {
            fired.up = false;
            this.moveKey.up = false;
            console.log('up', this.moveKey.up);
          }
          break;
        case 65: // a
          if (fired.left) {
            fired.left = false;
            this.moveKey.left = false;
            console.log('left', this.moveKey.left);
          }
          break;
        case 83: // s
          if (fired.down) {
            fired.down = false;
            this.moveKey.down = false;
            console.log('down', this.moveKey.down);
          }
          break;
        case 68: // d
          if (fired.right) {
            fired.right = false;
            this.moveKey.right = false;
            console.log('right', this.moveKey.right);
          }
          break;
      }
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
