import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  ajax: service(),
  model() {
    let url = 'https://guarded-island-78214.herokuapp.com/form/getall';
    let params = {type: 'GET'};
    return this.get('ajax').request(url, params);
  },

  setupController(controller, context) {
    controller.set('model', context);
  }
});
