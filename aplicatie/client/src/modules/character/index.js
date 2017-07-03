import { Box3 } from 'three';
import { socket } from 'socket';

export class Character {
  constructor(prototype, param, camera) {
    this.camera = camera;
    this.object = prototype.clone();
    this.player = prototype.clone();

    this.keyboard = {};
    this.collisionList = [];

    this.moveSpeed = 0.9;
    this.rotateSpeed = Math.PI * 0.01;

    this.object.add(camera);

    this.socketEvents();
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

  socketEvents() {
    setInterval(() => {
      socket.emit('movement',
      { position: this.object.position, rotation: this.object.rotation});
    }, 1000 / 30);

    socket.on('state', (coords) => {
        this.player.position.x = coords.position.x;
        this.player.position.y = coords.position.y;
        this.player.position.z = coords.position.z;
        this.player.rotation.y = coords.rotation._y;
    });
  }

  setPosition(dungeon) {
    if (!dungeon.children) {
      return;
    }
    let start = {};

    dungeon.children.forEach((children) => {
      if (children.name === 'start') {
        start.x = children.position.x;
        start.z = children.position.z;
      }
    });

    this.object.position.x = start.x;
    this.object.position.z = start.z;
    this.object.rotation.y = Math.PI / 2;

    this.player.position.x = start.x;
    this.player.position.z = start.z;
    this.player.rotation.y = Math.PI / 2;
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

  move(backPeddle) {
    if (backPeddle) {
      if (this.keyboard.KeyA) {
        this.object.rotation.y -= this.rotateSpeed;
      }
      if (this.keyboard.KeyD) {
        this.object.rotation.y += this.rotateSpeed;
      }
      if (this.keyboard.KeyS) {
        this.object.translateZ(-this.moveSpeed);
      }
      if (this.keyboard.KeyW) {
        this.object.translateZ(this.moveSpeed);
      }
    } else {
      if (this.keyboard.KeyA) {
        this.object.rotation.y += this.rotateSpeed;
      }
      if (this.keyboard.KeyD) {
        this.object.rotation.y -= this.rotateSpeed;
      }
      if (this.keyboard.KeyS) {
        this.object.translateZ(this.moveSpeed);
      }
      if (this.keyboard.KeyW) {
        this.object.translateZ(-this.moveSpeed);
      }
    }
    this.checkCollision();
  }

  update() {
    this.move();
  }
}
