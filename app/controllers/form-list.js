import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    openForm(formId) {
      this.transitionToRoute('form-viewer', formId);
    }
  }
});
