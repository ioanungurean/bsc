import { Box3 } from 'three';

export class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();

    this.keyboard = {};
    this.collisionList = [];

    this.object.add(camera);
    this.keyboardEvents();
    this.setPosition(param.dungeon);
    this.setCollisionList(param.dungeon);
  }

  keyboardEvents() {
    let onKeyDown = (event) => {
      this.keyboard[event.code] = true;
    };

    let onKeyUp = (event) => {
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
    return Object.values(this.keyboard).filter(
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
    let rotateSpeed = Math.PI * 0.01;

    if (backPeddle) {
      if (this.keyboard.KeyA) { // a
        this.object.rotation.y += rotateSpeed;
      }
      if (this.keyboard.KeyD) { // d
        this.object.rotation.y -= rotateSpeed;
      }
      if (this.keyboard.KeyS) { // s
        this.object.translateZ(-moveSpeed);
      }
      if (this.keyboard.KeyW) { // w
        this.object.translateZ(moveSpeed);
      }
    } else {
        console.log(this.keyboard);
      if (this.keyboard.KeyA) { // a
        this.object.rotation.y -= rotateSpeed;
      }
      if (this.keyboard.KeyD) { // d
        this.object.rotation.y += rotateSpeed;
      }
      if (this.keyboard.KeyS) { // s
        this.object.translateZ(moveSpeed);
      }
      if (this.keyboard.KeyW) { // w
        this.object.translateZ(-moveSpeed);
      }
    }
    this.checkCollision();
  }

  update() {
    this.move();
  }
}
