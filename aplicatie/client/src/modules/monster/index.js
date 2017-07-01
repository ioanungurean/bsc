import { Box3 } from 'three';

export class Monster {
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
        let boundingBox = new Box3().setFromObject(children);
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
    let currentBoundingBox = new Box3().setFromObject(this.object);

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
