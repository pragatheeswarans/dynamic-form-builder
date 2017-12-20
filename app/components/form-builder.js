import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import FormCreationMixin from 'dynamic-form-builder/mixins/form-element-creation';

export default Component.extend(FormCreationMixin, {
  windowConnector: service(),
  viewLiveForm: false,
  formTitle: 'Form Title',
  init() {
    this._super(...arguments);
    let elements = [];
    let formElements = (window.formBuilder || {}).formObject;
    if (isEmpty(formElements)) {
      window.formBuilder = {};
      elements.pushObject(this.createTextElement(0));
      elements.pushObject(this.createRadioGroup(1));
      elements.pushObject(this.createCheckBox(2));
    } else {
      elements = formElements;
    }
    this.set('draggedContent', elements);
    this.subscribeForListener();
    run.next(this, function() {
      this.set('formBaseHeight', $('.form-base').height());
      $('ul').sortable({
        start: function(event, ui) {
          let draggedElement = ui.item;
          if (draggedElement.hasClass('sortable-element')) {
            let oldIndex = draggedElement.index();
            draggedElement.oldPosition = oldIndex;
          }
        },
        stop: function(event, ui) {
          let toDrop = ui.item;
          let oldPosition = toDrop.oldPosition;
          let newPosition = toDrop.index();
          let oldLeft = ui.originalPosition.left;
          let newLeft = ui.position.left;
          let diff = Math.abs(oldLeft - newLeft);
          let action = 'insert';
          if (toDrop.hasClass('sortable-element')) {
            action = (diff > 300) ? 'remove' : 'sort';
          }
          window.handleSortingOfElements(action, toDrop, oldPosition, newPosition);
        }
      });

      $('.draggable').draggable({
        opacity: 0.7,
        revert: true,
        helper: 'clone',
        revertDuration: 0,
        connectToSortable: 'ul'
      });
    });
  },

  didRender() {
    this._super(...arguments);
    run.later(this, function() {
      $('.datepicker').datepicker();
    }, 500);
  },

  subscribeForListener() {
    this.get('windowConnector').subscribe({
      eventName: 'handleSortingOfElements',
      context: this,
      listener: this.handleSortingOfElements
    });
  },

  handleSortingOfElements(action, element, oldPos, newPos) {
    let formElements = this.get('draggedContent') || [];
    let newElement = {};
    if (action === 'remove') {
      formElements.removeAt(oldPos);
    } else if (action === 'insert') {
      if (element.hasClass('text-box')) {
        newElement = this.createTextElement(newPos);
      } else if (element.hasClass('radio-group')) {
        newElement = this.createRadioGroup(newPos);
      } else if (element.hasClass('check-box')) {
        newElement = this.createCheckBox(newPos);
      } else if (element.hasClass('date')) {
        newElement = this.createDatePicker(newPos);
      } else if (element.hasClass('text-area')) {
        newElement = this.createTextArea(newPos);
      }
      element.remove();
      formElements.insertAt(newPos, newElement);
    } else if (action === 'sort') {
      element = formElements[oldPos];
      formElements.removeAt(oldPos);
      formElements.insertAt(newPos, element);
    }
    this.set('draggedContent', formElements);
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

  actions: {
    showLiveForm() {
      let form = this.get('draggedContent') || {};
      form.set('title', this.get('formTitle') || 'Untitled Form');
      this.get('action')(form);
    },
    saveForm() {
      let form = this.get('draggedContent') || {};
      let url = 'https://guarded-island-78214.herokuapp.com/form/store';
      let params = {
        type: 'POST',
        data: {
          'JSONString': JSON.stringify(form),
          'name': (this.get('formTitle') || 'Untitled Form').toString()
        }
      };
      $.ajax(url, params).then((response) => {
        if (response.code === 0) {
          this.send('showLiveForm');
          alert('Form Added succesfully!');
        }
      }).catch((errorObj) => {
        if (errorObj.responseJSON.code === 1062) {
          alert('Form title already exists. Pls change it and try again.');
        } else {
          alert('Unable to submit form!');
        }
      });
    }
  }
});
