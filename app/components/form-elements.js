import Component from '@ember/component';

export default Component.extend({
  classNames: ['form-row', 'form-group', ' col-md-12'],
  tagName: 'li',
  classNameBindings: ['isLiveForm::sortable-element']
});
