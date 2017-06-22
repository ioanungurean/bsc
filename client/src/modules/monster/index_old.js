import { Box3 } from 'three';

export class Monster {
  constructor(prototype, param) {
    this.object = prototype.clone(); // clone messes animations for meshes

    this.currentDirection = 'N';
    this.directionList = ['N', 'S', 'W', 'E'];
    this.collisionList = [];
    this.moveSpeed = 0.5;
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

    dungeon.children.forEach((children) => {
      if (children.name === 'ground') {
        availablePositions.push({
          x: children.position.x,
          z: children.position.z
        })
      }
    });

    let random = Math.floor(Math.random() * availablePositions.length);
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

    dungeon.children.forEach((children) => {
      if (unavailableTiles.indexOf(children.name) !== -1) {
        let boundingBox = new Box3().setFromObject(children);
        this.collisionList.push(boundingBox);
      }
    });
  }

  /**
   * @description
   */
  chooseAvailableDirection() {
    this.directionList = this.directionList.filter((direction) => {
      return direction !== this.currentDirection;
    });
    this.currentDirection = this.directionList[Math.floor(Math.random() * this.directionList.length)];
    let failsafe = 0;
    while(!this.isWalking && failsafe < 4) {
      this.move();
      failsafe++;
    }
    this.directionList = ['N', 'S', 'W', 'E'];
  }

  /**
   * @description checks is the monster collides with something
   */
  checkCollision() {
    let currentBoundingBox = new Box3().setFromObject(this.object);

    this.collisionList.forEach((item) => {
      let collision = item.intersectsBox(currentBoundingBox);

      if (collision) {
        this.move(true);
        this.isWalking = false;
      } else {
        this.isWalking = true;
      }
    });
  }

  /**
   * @description
   */
  move(backPeddle) {
    switch (this.currentDirection) {
      case 'N':
        if (backPeddle) {
          this.object.position.x -= this.moveSpeed;
        } else { // normal walk
          this.object.position.x += this.moveSpeed;
        }
        break;
      case 'S':
        if (backPeddle) {
          this.object.position.x += this.moveSpeed;
        } else { // normal walk
          this.object.position.x -= this.moveSpeed;
        }
        break;
      case 'W':
        if (backPeddle) {
          this.object.position.z -= this.moveSpeed;
        } else { // normal walk
          this.object.position.z += this.moveSpeed;
        }
        break;
      case 'E':
        if (backPeddle) {
          this.object.position.z += this.moveSpeed;
        } else { // normal walk
          this.object.position.z -= this.moveSpeed;
        }
        break;
    }
    if (backPeddle) {
      this.chooseAvailableDirection();
    } else {
      this.checkCollision();
    }
  }

  /**
   * @description
   */
  update() {
    this.move();
  }
}
