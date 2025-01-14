//TODO: Maybe put default export from this module inside an iife so you always get fresh scoped {ids, classes, forms} by default, but can import the class if you want to configure it?

export class Meme {
  constructor(root) {
    this.root = root || document

    this.ids = new Proxy(Function(), {
      apply: this.idsApply,
      get: this.idsGet,
      has: this.idsHas,
      set: this.idsSet,
      deleteProperty: this.idsDelete,
    })

    this.classes = new Proxy({}, {
      get: this.classesGet,
      has: this.classesHas,
    })

    this.forms = new Proxy({}, {
      has: this.formsHas,
      get: this.formsGet,
      set: this.formsSet,
    })
  }

  // Arrow functions so this always means the instance of Meme class
  idsApply = (_, __, [root]) => {
    return (new Meme(root)).ids
  }
  idsGet = (_, name) => {
    return this.root.getElementById(name)
  }

  idsHas = (_, name) => {
    return !!this.root.getElementById(name)
  }

  idsSet = (_, name, value) => {
    const node = this.root.getElementById(name)
    if (node) {
      if (Array.isArray(value)) {
        node.innerHTML = value.join('')
      } else {
        node.textContent = String(value)
      }
    }
    return true //May throw if false
  }

  idsDelete = (_, name) => {
    //Wheeee `delete ids.test` just removes that node, fun!
    const node = this.root.getElementById(name)
    if (node) {
      this.root.getElementById(name).remove()
    }
    return true
  }

  classesHas = (_, name) => {
    return this.classesGet(_, name).length !== 0
  }

  classesGet = (_, name) => {
    return Array.from(this.root.getElementsByClassName(name))
  }

  formsApply = (_, __, root) => {
    return (new Meme(root)).forms
  }

  formsHas = (_, name) => {
    return !!this.formsGet(name)
  }

  formsGet = (_, name) => {
    return this.root.forms[name]
  }

  formsSet = (_, name, data) => {
    //TODO: set form entries with given data somehow?)
  }
}