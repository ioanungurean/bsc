import 'layout';
import { Login } from 'login';
/**
 * Bootstrap the App
 */
((callback) => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
})(() => {
  Login.init();
});
