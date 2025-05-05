//Convert any html string to an array of nodes.
const body = document.createElement('body')
export function html(string) {
  body.innerHTML = string
  const nodes = Array.from(body.childNodes)
  return nodes
}

//These methods on the HTML class accept any combination of strings, elements, text nodes and iterables. Iterables can be nested and can contain strings, elements, text nodes and iterables.
export class HTML {
  // Returns a string of html
  // Example: HTML.stringify('<b>', ElementNode, TextNode, NodeList, DocumentFragment, '</b>', etc...)
  static stringify(...args) {
    return args
    .filter(x => x)
    .flatMap(arg => {
      if (typeof arg === 'string') return arg
      else if (arg instanceof Element) return arg.outerHTML
      else if (arg instanceof Text) return arg.textContent
      else if (arg[Symbol.iterator]) return HTML.stringify(...arg)
      else if (arg instanceof DocumentFragment) return HTML.stringify(arg.childNodes)
      else if (arg instanceof Document) return HTML.stringify(arg.childNodes)
    })
    .join('')
  }

  // Returns an array of nodes. Accepts the same arguments as stringify.
  static parse(...args) {
    return html(HTML.stringify(args))
  }

}