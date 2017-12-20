export default ({
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
      value: false,
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
  }
});
