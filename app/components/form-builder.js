import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  windowConnector: service(),
  isTransitionDone: false,
  init() {
    this._super(...arguments);
    let elements = [];
    elements.pushObject(this.createTextElement(0));
    elements.pushObject(this.createRadioGroup(1));
    elements.pushObject(this.createCheckBox(2));
    this.set('draggedContent', elements);
    this.subscribeForListener();
    run.later(this, function() {
      this.set('formBaseHeight', $('.form-base').height());
      $('ul').sortable({
        stop: function(event, ui) {
          let toDrop = ui.item;
          let oldLeft = ui.originalPosition.left;
          let newLeft = ui.position.left;
          let diff = Math.abs(oldLeft - newLeft);
          if (toDrop.hasClass('sortable-element') && diff > 300) {
            $(toDrop).remove();
          }
          if (!toDrop.hasClass('sortable-element')) {
            window.insertFormElement(toDrop);
          }
        }
      });

      $('.draggable').draggable({
        opacity: 0.7,
        revert: true,
        helper: 'clone',
        revertDuration: 0,
        connectToSortable: 'ul'
      });
    }, 500);
  },

  didRender() {
    this._super(...arguments);
    run.later(this, function() {
      $('.datepicker').datepicker();
    }, 500);
  },

  createTextElement(position) {
    return {
      type: 'text_box',
      label: 'Field Label',
      value: 'Text Box Value',
      position
    };
  },

  createRadioGroup(position) {
    return {
      type: 'radio_button',
      label: 'Radio Label',
      value: '',
      name: `radio-${position}`,
      position,
      groupOptions: [
        {
          selected: true,
          label: 'Option - 1'
        },
        {
          selected: false,
          label: 'Option - 2'
        },
        {
          selected: false,
          label: 'Option - 3'
        }
      ]
    };
  },

  createCheckBox(position) {
    return {
      type: 'check_box',
      label: 'Checkbox Label',
      value: '',
      position
    };
  },

  createDatePicker(position) {
    return {
      type: 'date_picker',
      label: 'Date',
      value: '',
      position
    };
  },

  createTextArea(position) {
    return {
      type: 'text_area',
      label: 'Text Area',
      value: 'This is a sample value',
      position
    };
  },

  subscribeForListener() {
    this.get('windowConnector').subscribe({
      eventName: 'handleInsertElementInForm',
      context: this,
      listener: this.handleInsertElementInForm
    });
    this.get('windowConnector').subscribe({
      eventName: 'removeFormElement',
      context: this,
      listener: this.removeFormElement
    });
  },

  handleInsertElementInForm(toDrop) {
    let draggedContent = this.get('draggedContent') || [];
    let newElement = {};
    let position = toDrop.index() || 0;
    if (toDrop.hasClass('text-box')) {
      newElement = this.createTextElement(position);
    } else if (toDrop.hasClass('radio-group')) {
      newElement = this.createRadioGroup(position);
    } else if (toDrop.hasClass('check-box')) {
      newElement = this.createCheckBox(position);
    } else if (toDrop.hasClass('date')) {
      newElement = this.createDatePicker(position);
    } else if (toDrop.hasClass('text-area')) {
      newElement = this.createTextArea(position);
    }
    toDrop.remove();
    draggedContent.insertAt(position, newElement);
    this.set('draggedContent', draggedContent);
  },

  removeFormElement(toDrop) {
    let draggedContent = this.get('draggedContent') || [];
    let position = toDrop.index();
    draggedContent.removeAt(position);
    this.set('draggedContent', draggedContent);
  },

  formBaseHeight: computed('draggedContent.length', {
    get() {
      return $('.form-base').innerHeight();
    }, set(key, value) {
      return value;
    }
  }),

  isHorizontalBar: computed('formBaseHeight', {
    get() {
      let formHeight = this.get('formBaseHeight');
      return (!formHeight || formHeight < 550) ? true : false;
    }, set(key, value) {
      return value;
    }
  }),

  elementTypes: computed(function() {
    return [ 'text_box', 'radio_button', 'check_box' ];
  }),
});
