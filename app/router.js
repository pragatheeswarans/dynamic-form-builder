import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('form-builder');
  this.route('form-viewer', { path: 'form-viewer/:formId' });
  this.route('form-list');
});

export default Router;
