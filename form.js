//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {values, batch} by default, but can import the class if you want to configure it?

export class MemeForm {
  static event = new Event('change', {bubbles: true})
  static events = ['input', 'change']

  constructor(root, event) {
    this.root = getRoot(root) || document.forms[0]

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

  valuesApply = (_, __, [root]) => {
    return (new MemeForm(root)).values
  }
  valuesGet = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    //TODO: some way to get numbers?
    const node = this.root.elements[name]
    validateLabel(node)
    return node?.value
  }
  valuesSet = (_, name, value) => {
    //TODO: support checkboxes, maybe by passing an array of truthy / falsy values? Null or undefined array items could mean that don't modify this one.
    //Like values.check = [true, undefined, false]
    const node = this.root.elements[name]
    validateLabel(node)
    if (node) {
      node.value = value
      if (this.event) node.dispatchEvent(this.event)
    }
    return true //Setters are supposed to return true if they succeeded, but returning false throws.
  }
  valuesDelete = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    const node = this.root.elements[name]
    validateLabel(node)
    if (node) {
      node.value = node.defaultValue
    }
    return true
  }

  change = (arg) => {
    const root = getRoot(arg)
    if (root) {
      return (new MemeForm(root)).change
    }
    this.root.dispatchEvent(this.event || MemeForm.event)
  }

  batch = (callback) => {
    const root = getRoot(callback)
    if (root) {
      return (new MemeForm(root)).batch
    }

    const event = this.event
    this.event = null // Disable events while running batch.
    callback(this.values)
    this.root.dispatchEvent(event || MemeForm.event)
    this.event = event
  }

  listen = (...args) => {
    const root = getRoot(args[0])
    if (root) {
      return (new MemeForm(root)).listen
    }

    const callbacks = args.filter(arg => typeof arg === 'function')
    let events = args.filter(arg => typeof arg === 'string')
    if (!events.length) events = MemeForm.events

    for (let event of events) {
      for (let callback of callbacks) {
        this.root.addEventListener(event, () => callback(this.values))
      }
    }
  }
}

function getRoot(root) {
  root = document.forms[root] || root
  if (root instanceof HTMLFormElement || root instanceof HTMLFieldSetElement) {
    return root
  }
}

function validateLabel(input) {
  // This is harsh, but labels are the actual law nowadays.
  // (aria-label exists, but <label>s are just the best.)
  if (!input.labels?.length && !['output', 'hidden'].includes(input.type)) {
    throw new Error(`Missing <label>`, {cause: input});
  }
}