export class Meme {
  constructor(root) {
    this.root = root || document

    this.id = new Proxy(Function(), {
      get: this.idGet,
      has: this.idHas,
      set: this.idSet,
      deleteProperty: this.idDelete,
    })

    this.classes = new Proxy(Function(), {
      apply: this.classesApply,
      get: this.classesGet,
      has: this.classesHas,
      set: this.classesSet,
      deleteProperty: this.classesDelete,
      // ownKeys: this.classesOwnKeys, //list all classes? not sure how useful, but fun
    })

    this.form = new Proxy(Function(), {
      has: this.formHas,
      get: this.formGet,
      set: this.formSet,
      delete: this.formDelete,
    })

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
    const node = document.getElementById(name)
    if (this.root.contains(node)) set(node, value)
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
    const nodes = Array
      .from(document.getElementsByClassName(name))
      .filter(node => this.root.contains(node))

    nodes.forEach((node, i) => {
      let content = value
      if (typeof value === 'function') content = value(node, i)
      set(node, content)
    })
    return true
  }
  classesDelete = (_, name) => {
    const nodes = Array.from(document.getElementsByClassName(name))
    for (let node of nodes) {
      if (this.root.contains(node)) node.remove()
    }
    return true
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

function set(node, content) {
  const html = Array.isArray(content) && content.join('')
  if (html) node.innerHTML = html
  else node.textContent = String(content)
}

///////////////////////

export const id = (new Meme()).id
export const classes = (new Meme()).classes
export const form = (new Meme()).form