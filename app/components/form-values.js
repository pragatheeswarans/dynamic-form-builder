import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'td',
  showFormValues: false,
  init() {
    this._super();
    $('[data-toggle="tooltip"]').tooltip();
  },
  click() {
    this.get('action')(this.get('model.id'));
  },
  formValues: computed('model', function() {
    return JSON.parse(this.get('model.submittedValue'));
  }),
  actions: {
    showFormData() {
      this.toggleProperty('showFormValues');
    }
  }
});
