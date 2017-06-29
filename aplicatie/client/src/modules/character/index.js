import { Box3 } from 'three';

export class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();

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
          }
          break;
        case 65: // a
          if (!fired.left) {
            fired.left = true;
            this.moveKey.left = true;
          }
          break;
        case 83: // s
          if (!fired.down) {
            fired.down = true;
            this.moveKey.down = true;
          }
          break;
        case 68: // d
          if (!fired.right) {
            fired.right = true;
            this.moveKey.right = true;
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
          }
          break;
        case 65: // a
          if (fired.left) {
            fired.left = false;
            this.moveKey.left = false;
          }
          break;
        case 83: // s
          if (fired.down) {
            fired.down = false;
            this.moveKey.down = false;
          }
          break;
        case 68: // d
          if (fired.right) {
            fired.right = false;
            this.moveKey.right = false;
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

    this.object.position.y = 10;
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
        this.move(true);
      }
    });
  }

  checkMoveDiagonally() {
    return Object.values(this.moveKey).filter(
      (direction) => { return direction === true;}
    ).length === 2 ? true : false;
  }

  getMoveSpeed() {
    let moveSpeed = 1.5;

    if (this.checkMoveDiagonally()) {
      return moveSpeed * 1 / Math.sqrt(2);
    }

    return moveSpeed;
  }

  move(backPeddle) {
    let moveSpeed = this.getMoveSpeed();

    if (backPeddle) {
      if (this.moveKey.up) {
        this.object.position.x += moveSpeed;
      }
      if (this.moveKey.down) {
        this.object.position.x -= moveSpeed;
      }
      if (this.moveKey.left) {
        this.object.position.z -= moveSpeed;
      }
      if (this.moveKey.right) {
        this.object.position.z += moveSpeed;
      }
    } else {
      if (this.moveKey.up) {
        this.object.position.x -= moveSpeed;
      }
      if (this.moveKey.down) {
        this.object.position.x += moveSpeed;
      }
      if (this.moveKey.left) {
        this.object.position.z += moveSpeed;
      }
      if (this.moveKey.right) {
        this.object.position.z -= moveSpeed;
      }
    }
    this.checkCollision();
  }

  update() {
    this.move();
  }
}
