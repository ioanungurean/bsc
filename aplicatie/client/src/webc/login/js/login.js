import { App } from 'app';
import { socket } from '../../../bootstrap/app/core/socket';

import * as LoginHTML from '../template/login';

export class Login {
  constructor() {
    this.bindHTML();
  }

  static init() {
    return new Login();
  }

  bindHTML() {
    document.querySelector('.login').innerHTML = LoginHTML;

    document.querySelector('.login__button').onclick = (event) => {
      event.preventDefault();

      const username = document.querySelector('.login__input').value;

      document.querySelector('.login').style.display = 'none';
      document.querySelector('.main').style.display = 'flex';

      this.wsConnect(username);
    };
  }

  wsConnect(username) {
    socket.emit('new player', username);
    this.runApp();
  }

  runApp() {
    let app = new App();
    app.run();
  }
}
