import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    viewForm(formContent) {
      window.formBuilder.formObject = formContent;
      this.transitionToRoute('form-viewer', 0);
    }
  }
});
