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

    //TODO: maybe use tree.prototype.valueOf = ... to have tree return the full name tree when tree is used as a value by itself. Like console.log(tree) shows {rows: {0: {sum: valuehere}, 1: {sum: valuehere}}}
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
    const node = this.root.elements[name]
    validate(node)
    return valueOf(node)
  }
  valuesSet = (_, name, value) => {
    const node = this.root.elements[name]
    validate(node)
    set(node, value)
    return true
  }
  valuesDelete = (_, name) => {
    const node = this.root.elements[name]
    validate(node)
    del(node)
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
      //TODO:
      // get all nodes that match this path
      // if value is an array, set by that
      // if value is string, set all to that string
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
      //TODO:
      // get all nodes that match this path
      // delete all those nodes
    }
  }

  leafApply = (_, __, [root]) => {
    return (new Form(getRoot(root))).leaf
  }
  leafGet = (_, name) => {
    //TODO: This should work with id or name just like form.elements.
    //TODO: this should work with multiple elements just like all the other methods.
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

function validate(node) {
  if (!node) {
    throw new Error(`Node missing.`, {cause: node});
  }
  if (node instanceof RadioNodeList) {
    return node.forEach(validate)
  }
  const unlabelledElement = ['fieldset', 'output', 'hidden'].includes(node.type)
  const hasLabel = node.labels?.length
  const hasAria = node.getAttribute('aria-label') || node.getAttribute('aria-labelledby')
  if (hasLabel || hasAria || unlabelledElement) {
    //Right on!
  } else {
    console.error('Missing label for ', node)
  }
}

function valueOf(node) {
  const nodes = node instanceof RadioNodeList && Array.from(node)
  if (nodes && nodes.every(node => node.type !== 'radio')) {
    const values = nodes.map(n => valueOf(n))
    return values
  }
  // if (node.valueAsDate !== null) return node.valueAsDate
  // if (node.valueAsNumber !== NaN) return node.valueAsNumber
  if (node.type === 'checkbox') return node.checked ? node.value : null
  if (node.type === 'fieldset') return (new Form(node)).values
  return node.value
}

function set(node, value) {
  if (node instanceof RadioNodeList && Array.isArray(value)) {
    Array.from(node).map((n, i) => set(n, value[i]))
  }
  if (value === null) {
    if (node.type === 'checkbox') node.checked = node.getAttribute('checked')
    else node.value = node.defaultValue
  } else {
    if (node.type === 'checkbox') node.checked = value
    else node.value = value
  }
}

function del(node) {
  const nodes = node instanceof RadioNodeList && Array.from(node)
  if (nodes) return nodes.forEach((n, i) => del(n))
  node.remove()
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

///////////////////////

export const values = (new Form()).values
export const tree = (new Form()).tree
export const leaf = (new Form()).leaf
export const dispatch = (new Form()).dispatch
export const batch = (new Form()).batch
export const listen = (new Form()).listen
export const ignore = (new Form()).ignore
