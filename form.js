//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {values, batch} by default, but can import the class if you want to configure it?

export class MemeForm {
  static event = new Event('change', {bubbles: true})
  static events = ['input', 'change']

  constructor(form, event) {
    this.form = document.forms[form] || form || document.forms[0]

    if (this.form instanceof HTMLFormElement !== true) {
      console.warn('No form found for', this)
    }

    if (event === true) {
      this.event = MemeForm.event
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
    return (new MemeForm(form)).values
  }
  valuesGet = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    //TODO: some way to get numbers?
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
  valuesDelete = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    const node = this.form.elements[name]
    if (node) {
      node.value = node.defaultValue
    }
    return true
  }

  change = (arg) => {
    const newScope = arg instanceof HTMLFormElement && arg
    if (newScope) {
      return (new MemeForm(newScope)).change
    }
    this.form.dispatchEvent(this.event || MemeForm.event)
  }

  batch = (callback) => {
    const newScope = callback instanceof HTMLFormElement && callback
    if (newScope) {
      return (new MemeForm(newScope)).batch
    }
    const event = this.event
    this.event = null // Disable events while running batch.
    callback(this.values)
    this.form.dispatchEvent(event || MemeForm.event)
    this.event = event
  }

  listen = (...args) => {
    const newScope = args[0] instanceof HTMLFormElement && args[0]
    if (newScope) {
      return (new MemeForm(args[0])).listen
    }
    const callbacks = args.filter(arg => typeof arg === 'function')
    let events = args.filter(arg => typeof arg === 'string')

    if (!events.length) events = MemeForm.events

    for (let event of events) {
      for (let callback of callbacks) {
        this.form.addEventListener(event, () => callback(this.values))
      }
      //TODO: debounce all? Maybe the expectation is that this is synchronous?
    }
  }
}