//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {ids, classes, forms} by default, but can import the class if you want to configure it?

export class Meme {
  constructor(root) {
    this.root = root || document

    this.ids = new Proxy(Function(), {
      apply: (_, __, [root]) => this.idsApply(root),
      get: this.idsGet,
      has: this.idsHas,
      set: this.idsSet,
      deleteProperty: this.idsDelete,
    })

    this.classes = new Proxy(Function(), {
      apply: this.classesApply,
      get: this.classesGet,
      has: this.classesHas,
      deleteProperty: this.classesDelete,
      // ownKeys: this.classesOwnKeys, //list all classes? not sure how useful, but fun
    })

    this.forms = new Proxy(Function(), {
      apply: this.formsApply,
      has: this.formsHas,
      get: this.formsGet,
      set: this.formsSet,
      delete: this.formsDelete,
    })
  }



  //TODO: don't need to write apply function as a copy for ids, classes and forms.
  // Arrow functions so this always means the instance of Meme class
  idsApply = (root) => {
    return (new Meme(root)).ids
  }
  idsHas = (_, name) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) return !!node
  }
  idsGet = (_, name) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) return node
  }
  idsSet = (_, name, value) => {
    const node = document.getElementById(name)
    if (this.root.contains(node)) {
      if (Array.isArray(value)) node.innerHTML = value.join('')
      else node.textContent = String(value)
    }
    return true
  }
  idsDelete = (_, name) => {
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
  classesDelete = (_, name) => {
    const nodes = Array.from(document.getElementsByClassName(name))
    for (let node of nodes) {
      if (this.root.contains(node)) {
        node.remove()
      }
    }
    return true
  }



  formsApply = (_, __, [root]) => {
    return (new Meme(root)).forms
  }
  formsHas = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) return !!node
  }
  formsGet = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) return node
  }
  formsSet = (_, name, data) => {
    //TODO: set form entries with given data somehow?
  }
  formsDelete = (_, name) => {
    const node = document.forms[name]
    if (this.root.contains(node)) node.reset()
    return true
  }

}