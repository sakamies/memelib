//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {ids, classes, forms} by default, but can import the class if you want to configure it?

export class Meme {
  constructor(root) {
    this.root = root || document

    this.id = new Proxy(Function(), {
      apply: this.idApply,
      get: this.idGet,
      has: this.idHas,
      set: this.idSet,
      deleteProperty: this.idDelete,
    })

    this.classes = new Proxy(Function(), {
      apply: this.classesApply,
      get: this.classesGet,
      has: this.classesHas,
      deleteProperty: this.classesDelete,
      // ownKeys: this.classesOwnKeys, //list all classes? not sure how useful, but fun
    })

    this.query = new Proxy(Function(), {
      apply: this.queryApply,
      has: this.queryHas,
      get: this.queryGet,
      set: this.querySet,
      delete: this.queryDelete,
    })

    this.form = new Proxy(Function(), {
      apply: this.formApply,
      has: this.formHas,
      get: this.formGet,
      set: this.formSet,
      delete: this.formDelete,
    })

  }



  //TODO: don't need to write apply function as a copy for id, classes and forms.
  // Arrow functions so this always means the instance of Meme class
  idApply = (_, __, [root]) => {
    return (new Meme(root)).id
  }
  idHas = (_, name) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) return !!node
  }
  idGet = (_, name) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) return node
  }
  idSet = (_, name, value) => {
    const html = Array.isArray(value) && value.join('')
    const node = document.getElementById(name)
    if (this.root.contains(node)) {
      if (html) node.innerHTML = html
      else node.textContent = String(value)
    }
    return true
  }
  idDelete = (_, name) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) node.remove()
    return true
  }



  classesApply = (_, __, [root]) => {
    return (new Meme(root)).classes
  }
  classesHas = (_, name) => {
    const nodes = Array.from(document.getElementsByClassName(name))
    return nodes.every(node => this.root.contains(node))
  }
  classesGet = (_, name) => {
    return Array.from(document.getElementsByClassName(name))
  }
  classesSet = (_, name, value) => {
    const html = Array.isArray(value) && value.join('')
    const nodes = Array
      .from(document.getElementsByClassName(name))
      .filter(node => this.root.contains(node))

    nodes.forEach(node => {
      if (html) node.innerHTML = html
      else node.textContent = String(value)
    })
    return true
  }
  classesDelete = (_, name) => {
    const nodes = Array.from(document.getElementsByClassName(name))
    for (let node of nodes) {
      if (this.root.contains(node)) {
        node.remove()
      }
    }
    return true
  }



  queryApply = (_, __, [root]) => {
    return (new Meme(root)).query
  }
  queryHas = (_, selector) => {
    return !!this.root.querySelectorAll(selector).length
  }
  queryGet = (_, selector) => {
    return this.root.querySelectorAll(selector)
  }
  queryDelete = (_, selector) => {
    const nodes = Array.from(this.root.querySelectorAll(selector))
    for (let node of nodes) {
      node.remove()
    }
    return true
  }



  formApply = (_, __, [root]) => {
    return (new Meme(root)).form
  }
  formHas = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) return !!node
  }
  formGet = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) return node
  }
  formSet = (_, name, data) => {
    //TODO: set form entries with given data somehow?
  }
  formDelete = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) node.reset()
    return true
  }

}