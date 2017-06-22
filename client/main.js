import 'layout';
import { App } from 'app';
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
  let app = new App();
  app.run();
});
