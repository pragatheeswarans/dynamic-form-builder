import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    viewForm(formContent) {
      window.formBuilder.formObject = formContent;
      this.transitionTo('form-viewer');
    }
  }
});
