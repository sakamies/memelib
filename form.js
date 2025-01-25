export class Form {
  static event = new Event('change', {bubbles: true})
  static events = ['input', 'change']

  root
  path

  constructor(root, path) {
    this.root = getRoot(root) || document.forms[0]
    this.path = path || []

    this.values = new Proxy(function values(){}, {
      apply: this.valuesApply,
      get: this.valuesGet,
      has: this.valuesHas,
      set: this.valuesSet,
      deleteProperty: this.valuesDelete,
    })

    this.tree = new Proxy(function tree(){}, {
      apply: this.treeApply,
      get: this.treeGet,
      has: this.treeHas,
      set: this.treeSet,
      deleteProperty: this.treeDelete,
    })

    this.leaf = new Proxy(function leaf(){}, {
      apply: this.leafApply,
      get: this.leafGet,
      has: this.leafHas,
      set: this.leafSet,
      deleteProperty: this.leafDelete,
    })
  }

  valuesApply = (_, __, [root]) => {
    return (new Form(getRoot(root))).values
  }
  valuesGet = (_, name) => {
    //TODO: some way to get numbers?
    const node = this.root.elements[name]
    validate(node)
    //if (node.valueAsDate !== null) return node.valueAsDate
    //if (node.valueAsNumber !== NaN) return node.valueAsNumber
    if (node.type === 'checkbox') return node.checked ? node.value : null
    if (node.type === 'fieldset') return (new Form(node)).values
    return node.value
  }
  valuesSet = (_, name, value) => {
    const node = this.root.elements[name]
    validate(node)
    if (value === null) {
      if (node.type === 'checkbox') node.checked = node.getAttribute('checked')
      else node.value = node.defaultValue
    } else {
      if (node.type === 'checkbox') node.checked = value
      else node.value = value
    }
    return true
  }
  valuesDelete = (_, name) => {
    const node = this.root.elements[name]
    validate(node)
    node.remove()
    return true
  }

  treeApply = (_, __, [param]) => {
    return (new Form(getRoot(root))).tree
  }
  treeGet = (_, name) => {
    const path = [...this.path, name]
    const fullName = nameFromPath(path)
    const node = this.root.elements[fullName]
    if (node) {
      return this.values[fullName]
    } else {
      return (new Form(this.root, path)).tree
    }
  }
  treeSet = (_, name, value) => {
    const path = [...this.path, name]
    const fullName = nameFromPath(path)
    const node = this.root.elements[fullName]
    if (node) {
      this.values[fullName] = value
    } else {
      // What to set when partial match in a tree?
      // Maybe set the values of the first match up to that path?
      // Set values of all matches? Do it by function like in classes case in memelib?
      // return this.tree(name)
    }
    return true
  }
  treeDelete = (_, name) => {
    const path = [...this.path, name]
    const fullName = nameFromPath(path)
    const node = this.root.elements[fullName]
    if (node) {
      delete this.values[fullName]
    } else {
      // What to delete when partial match in a tree?
      // Same issue as in treeSet
    }
  }

  leafApply = (_, __, [root]) => {
    return (new Form(getRoot(root))).leaf
  }
  leafGet = (_, name) => {
    //TODO: this, set and delete should also set by ID like form.elements.something because id and name seem to be interchangeable in form.elements. But which one comes first!?
    const node = this.root.querySelector(`[name$="[${CSS.escape(name)}]"]`)
    const nodeInElements = Array.from(this.root.elements).includes(node)
    if (nodeInElements) return this.values[node.name]
  }
  leafSet = (_, name, value) => {
    const node = this.root.querySelector(`[name$="[${CSS.escape(name)}]"]`)
    const nodeInElements = Array.from(this.root.elements).includes(node)
    if (nodeInElements) this.values[node.name] = value
    return true
  }
  leafDelete = (_, name) => {
    const node = this.root.querySelector(`[name$="[${CSS.escape(name)}]"]`)
    const nodeInElements = Array.from(this.root.elements).includes(node)
    if (nodeInElements) delete this.values[node.name]
    return true
  }

  dispatch = (arg) => {
    const root = getRoot(arg)
    if (root) {
      return (new Form(root)).dispatch
    }
    this.root.dispatchEvent(Form.event)
  }

  batch = (callback) => {
    const root = getRoot(callback)
    if (root) {
      return (new Form(root)).batch
    }

    callback(this.values)
    this.root.dispatchEvent(event || Form.event)
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

  ignore = (...events) => {
    //TODO: ignore events with these names. This would require gathering callbacks per event name somewhere in listen function and ignoring each of those by event name here.
  }
}

function nameFromPath(path) {
  return path.map((part, i) => i === 0 ? part : `[${part}]`).join('')
}

function getRoot(root) {
  root = document.forms[root] || root
  if (root instanceof HTMLFormElement || root instanceof HTMLFieldSetElement) {
    return root
  }
}

function validate(node) {
  if (!node) {
    console.error(node)
    throw new Error(`Node node?`, {cause: node});
  }
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
export const tree = (new Form()).tree
export const leaf = (new Form()).leaf
export const dispatch = (new Form()).dispatch
export const batch = (new Form()).batch
export const listen = (new Form()).listen
export const ignore = (new Form()).ignore
