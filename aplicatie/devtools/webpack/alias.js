const path = require('path');

class AliasProvider {
  static get bootstrap() {
    return {
      app: path.resolve('client/src/bootstrap/app'),
      socket: path.resolve('client/src/bootstrap/app/core/socket.js')
    };
  }

  static get modules() {
    return {
      dungeon: path.resolve('client/src/modules/dungeon'),
      tile: path.resolve('client/src/modules/tile'),
      tilePrototype: path.resolve('client/src/modules/tile/prototype/tile'),
      monster: path.resolve('client/src/modules/monster'),
      monsterPrototype: path.resolve('client/src/modules/monster/prototype/monster'),
      character: path.resolve('client/src/modules/character'),
      characterPrototype: path.resolve('client/src/modules/character/prototype/character')
    };
  }

  static get ui() {
    return {
      layout: path.resolve('client/src/ui/layout')
    };
  }

  static get webc() {
    return {
      login: path.resolve('client/src/webc/login')
    };
  }
}

module.exports = AliasProvider;
