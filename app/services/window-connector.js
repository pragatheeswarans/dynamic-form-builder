/* eslint no-unused-vars: "off" */
import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  init() {
    this._super(...arguments);
    let self = this;
    window.insertFormElement = function(params) {
      self.publish('handleInsertElementInForm', ...arguments);
    };
    window.removeFormElement = function(params) {
      self.publish('removeFormElement', ...arguments);
    };
  },

  subscribe(options) {
    this.on(options.eventName, options.context, options.listener);
  },

  unsubscribe(options) {
    this.off(options.eventName, options.context, options.listener);
  },

  publish(eventName) {
    this.trigger(...arguments);
  }
});
