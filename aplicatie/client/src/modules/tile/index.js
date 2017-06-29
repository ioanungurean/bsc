export class Tile {
  constructor(prototype, param) {
    this.object = prototype.clone();
    this.object.position.x = param.position.x;
    this.object.position.z = param.position.z;
  }
}
