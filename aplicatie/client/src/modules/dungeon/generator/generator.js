export class DungeonGenerator {
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
   * @description Place starting & destination points
   */
  static generateSpectrumPoints(size, layout) {
    layout[size - 1][10] = {
      type: 'start'
    };
    layout[0][DungeonGenerator.generateRandomNumber(1, size - 1)] = {
      type: 'finish'
    };
  }
}
