import Component from '@ember/component';
import { or, equal } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  isRadioType: equal('type', 'radio'),
  isCheckBoxType: equal('type', 'checkbox'),
  isRadioOrCheckbox: or('isRadioType', 'isCheckBoxType')
});
