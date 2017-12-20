import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),
  canShowFormSubmit: computed('model.id', function() {
    return this.get('model.id') !== 0;
   }),
  getSerializedObject(model) {
    let formData = [];
    (model || []).forEach((formObject) => {
      let tempFormData = {};
      if (formObject.type === 'radio_button') {
        let selectedOption = ((formObject.groupOptions || []).findBy('selected') || {}).label;
        tempFormData.label = formObject.label;
        tempFormData.value = selectedOption;
      } else {
        tempFormData.label = formObject.label;
        tempFormData.value = formObject.value;
      }
      formData.pushObject(tempFormData);
    });
    return formData;
  },
  actions: {
    submitForm() {
      let model = this.get('model');
      let formId = model.get('id');
      let serializedObj = this.getSerializedObject(model);
      let url = `https://guarded-island-78214.herokuapp.com/form/submit?form_id=${formId}`;
      let params = { type: 'POST', data: { 'JSONString': JSON.stringify(serializedObj) } };
      $.ajax(url, params).then((response) => {
        if (response.code === 0) {
          this.transitionToRoute('form-list');
          this.get('notify').success('Form submitted succesfully!');
        }
      }).catch(() => {
          this.get('notify').error('Unable to submit form!');
      });
    }
  }
});
