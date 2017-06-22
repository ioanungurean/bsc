export class DungeonGenerator {
  /**
   * @description Generates the dungeon
   */
  static generateLayout(size) {
    let dungeonLayout = DungeonGenerator.generateCleanLayout(size, {
      type: 'wall'
    });
    // DungeonGenerator.generateRandomRooms(size, dungeonLayout);
    // DungeonGenerator.generateSpectrumPoints(size, dungeonLayout);
    // DungeonGenerator.generateTunnels(size, dungeonLayout);
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
  static checkRoomOverlap(size, layout, position, dimension) {
    let isOverlapped = false;

    if (position.x + dimension.width >= size || position.y + dimension.height >= size) {
      isOverlapped = true;
      return isOverlapped;
    }

    if (layout[position.x][position.y].type === 'ground') {
      isOverlapped = true;
      return isOverlapped;
    }

    for (let i = position.x - 1; i < position.x + dimension.width + 1; i++) {
      for (let j = position.y - 1; j < position.y + dimension.height + 1; j++) {
        if (layout[i][j].type === 'ground') {
          isOverlapped = true;
        }
      }
    }

    return isOverlapped;
  }

  /**
   * @description Place random rooms across the dungeon
   */
  static generateRandomRooms(size, layout) {
    let nrAttempts = 120;

    for (let i = 0; i < nrAttempts; i++) {
      let roomSize = DungeonGenerator.generateRoomSize(size);
      let roomPosition = DungeonGenerator.generateRoomPosition(size);

      if (!DungeonGenerator.checkRoomOverlap(size, layout, roomPosition, roomSize)) {
        for (let j = roomPosition.x; j < roomPosition.x + roomSize.width; j++) {
          for (let k = roomPosition.y; k < roomPosition.y + roomSize.height; k++) {
            layout[j][k] = {
              type: 'ground',
              isRoom: true
            };
          }
        }
      }
    }
  }

  /**
   * @description Place destination & starting spawn points
   */
  static generateSpectrumPoints(size, layout) {
    layout[size - 1][10] = {
      type: 'spawn'
    };
  // layout[0][DungeonGenerator.generateRandomNumber(1, size - 1)] = {
  //   type: 'exit'
  // };
  }

  static generateStartingPoint(size, layout) {
    let random = DungeonGenerator.generateRandomNumber(1, size - 1);
    layout[size - 1][random] = { type: 'spawn' };
    return {
      x: size - 1,
      y: random
    }
  }

  static getNextStep(position, size, layout) {
    let nextStep = null;
  }

  static getNextStep2(position, size, layout) {
    if (!position) {
      return;
    }
    let failsafe = 0;
    let nextStep = null;
    let encounteredRoom = false;
    let directions = ['N', 'S', 'W', 'E'];

    while (!nextStep && !encounteredRoom && directions.length && failsafe < 100000) {
      let random = DungeonGenerator.generateRandomNumber(0, directions.length);
      console.log('b', directions[random]);
      switch (directions[random]) {
        case 'N':
          if (position.x + 1 < size - 2) {
            if (layout[position.x + 1][position.y].isRoom) {
              console.log('found room');
              encounteredRoom = true;
            } else if (layout[position.x + 1][position.y].type !== 'ground') {
              nextStep = {
                x: position.x + 1,
                y: position.y
              };
            }
          }
          break;

        case 'S':
          if (position.x + 1 > 0) {
            if (layout[position.x - 1][position.y].isRoom) {
              console.log('found room');
              encounteredRoom = true;;
            } else if (layout[position.x - 1][position.y].type !== 'ground') {
              nextStep = {
                x: position.x - 1,
                y: position.y
              };
            }
          } else {
            console.warn('EXIT FOUND', position);
          }
          break;

        case 'W':
          if (position.y + 1 < size - 2) {
            if (layout[position.x][position.y + 1].isRoom) {
              console.log('found room');
              encounteredRoom = true;;
            } else if (layout[position.x][position.y + 1].type !== 'ground') {
              nextStep = {
                x: position.x,
                y: position.y + 1
              };
            }
          }
          break;

        case 'E':
          if (position.y - 1 > 1) {
            if (layout[position.x][position.y - 1].isRoom) {
              console.log('found room');
              encounteredRoom = true;;
            } else if (layout[position.x][position.y - 1].type !== 'ground') {
              nextStep = {
                x: position.x,
                y: position.y - 1
              };
            }
          }
          break;
      }
      failsafe++;
      directions.splice(random, 1);
      console.log(directions);
    }
    console.log('--------------------------');
    console.log('next step', nextStep);
    if (nextStep) {
      layout[nextStep.x][nextStep.y] = {
        type: 'ground'
      };
    }
    return nextStep;
  }

  static generateTunnels(size, layout) {
    let startingPoint = {
      x: size - 1,
      y: 10
    };
    let failsafe = 0;
    // let pointA = DungeonGenerator.generateRoomPosition(size);
    // let pointB = DungeonGenerator.generateRoomPosition(size);
    // let tunnelSteps = [pointA];
    while (startingPoint) {
      console.log('a');
      startingPoint = DungeonGenerator.getNextStep(startingPoint, size, layout);
      failsafe++;
    }
  }
}
