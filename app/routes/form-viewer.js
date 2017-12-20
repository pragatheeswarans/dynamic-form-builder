import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  ajax: service(),
  model(params) {
    let formId = params.formId;
    if (formId !== 0) {
      let url = "https://guarded-island-78214.herokuapp.com/form/get?form_id=" + formId;
      let dataParams = { type: 'GET' };
      return this.get('ajax').request(url, dataParams);
    }
    return undefined;
  },

  setupController(controller, context) {
    let data = (window.formBuilder || {}).formObject;
    let title = (data || {}).title;
    let id = 0;
    if (context[0]) {
      data = JSON.parse(context[0].data);
      title = context[0].name;
      id = context[0].id;
    }
    controller.set('model', data);
    controller.set('model.title', title);
    controller.set('model.id', id);
  },

  actions: {
    goBack() {
      window.history.back();
    }
  }
});
