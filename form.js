export class Form {
  static event = new Event('change', {bubbles: true})
  static events = ['input', 'change']

  constructor(root, event) {
    this.root = getRoot(root) || document.forms[0]

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

  valuesApply = (_, __, [root]) => {
    return (new Form(root)).values
  }
  valuesGet = (_, name) => {
    //TODO: some way to get numbers?
    const node = this.root.elements[name]
    validateLabel(node)
    if (node.type === 'fieldset') return (new Form(node)).values
    else if (node.type === 'checkbox') return node.checked ? node.value : null
    else return node.value
  }
  valuesSet = (_, name, value) => {
    const node = this.root.elements[name]
    validateLabel(node)
    if (node) {
      if (node.type === 'checkbox') node.checked = value
      else node.value = value
      if (this.event) node.dispatchEvent(this.event)
    }
    return true //Setters are supposed to return true if they succeeded, but returning false throws.
  }
  valuesDelete = (_, name) => {
    //TODO: support checkboxes? Maybe get all checkboxes that match this name and return an array of values?
    const node = this.root.elements[name]
    validateLabel(node)
    if (node) {
      if (node.type === 'checkbox') node.checked = node.getAttribute('checked')
      else node.value = node.defaultValue
    }
    return true
  }

  change = (arg) => {
    const root = getRoot(arg)
    if (root) {
      return (new Form(root)).change
    }
    this.root.dispatchEvent(this.event || Form.event)
  }

  batch = (callback) => {
    const root = getRoot(callback)
    if (root) {
      return (new Form(root)).batch
    }

    const event = this.event
    this.event = null // Disable events while running batch.
    callback(this.values)
    this.root.dispatchEvent(event || Form.event)
    this.event = event
  }

  listen = (...args) => {
    const root = getRoot(args[0])
    if (root) {
      return (new Form(root)).listen
    }

    const callbacks = args.filter(arg => typeof arg === 'function')
    let events = args.filter(arg => typeof arg === 'string')
    if (!events.length) events = Form.events

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

function validateLabel(node) {
  // This is harsh, but labels are the actual law nowadays.
  const unlabelledElement = ['fieldset', 'output', 'hidden'].includes(node.type)
  const hasLabel = node.labels?.length
  const hasAria = node.getAttribute('aria-label') || node.getAttribute('aria-labelledby')
  if (hasLabel || hasAria || unlabelledElement) {
    //Right on!
  } else {
    console.error(node)
    throw new Error(`Missing <label>`, {cause: node});
  }
}

///////////////////////

export const values = (new Form()).values
export const change = (new Form()).change
export const batch = (new Form()).batch
export const listen = (new Form()).listen