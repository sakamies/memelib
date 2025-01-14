//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {values, batch} by default, but can import the class if you want to configure it?

export class Form {
  static event = new Event('change', {bubbles: true})

  constructor(form, event) {
    this.form = document.forms[form] || form || document.forms[0] // Maybe verify this is an HTMLFormElement?
    if (event === true) {
      this.event = Form.event
    } else if (event) {
      this.event = event
    }
    this.values = new Proxy(Function(), {
      apply: this.valuesApply,
      get: this.valuesGet,
      has: this.valuesHas,
      set: this.valuesSet,
      deleteProperty: this.valuesDelete,
    })
  }

  valuesApply = (_, __, [form]) => {
    return (new Form(form)).values
  }
  valuesGet = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    return this.form.elements[name]?.value
  }
  valuesSet = (_, name, value) => {
    //TODO: support checkboxes, maybe by passing an array of truthy / falsy values? Null or undefined array items could mean that don't modify this one.
    //Like values.check = [true, undefined, false]
    const element = this.form.elements[name]
    if (element) {
      element.value = value
      if (this.event) element.dispatchEvent(this.event)
    }
    return true //Setters are supposed to return true if they succeeded, but returning false throws.
  }

  batch = (callback) => {
    if (callback instanceof HTMLFormElement) {
      return (new Form(callback)).batch
    }
    const event = this.event
    this.event = null // Disable events while running batch.
    callback(this.values)
    this.form.dispatchEvent(event || Form.event)
    this.event = event
  }
}