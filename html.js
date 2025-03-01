//TODO: test that this actually works at all.

// There has to be a million billion npm modules like this already.

const parser = new DOMParser()

export function htmldoc(string) {
  return parser.parseFromString(string, 'text/html')
}

export function html(string) {
  return Array.from(htmldoc(string).childNodes)
}

export class HTML {

  // HTML class methods accept any combination of strings, elements, text nodes and iterables.
  // Iterables can contain nodes and strings or iterables.
  // HTML.stringify('<b>', ElementNode, TextNode, NodeList, DocumentFragment, '</b>', etc...)
  // HTML.parse() works exactly the same way.
  // No need for this yet though, not sure it's really needed anywhere.

  // Returns a string of html
  static stringify(...args) {
    return args
    .filter(x => x)
    .flatMap(arg => {
      if (typeof arg === 'string') return arg
      else if (arg instanceof Element) return arg.outerHTML
      else if (arg instanceof Text) return arg.textContent
      else if (arg[Symbol.iterator]) return HTML.stringify(iterable)
      else if (arg instanceof DocumentFragment) return HTML.stringify(arg.childNodes)
      else if (arg instanceof Document) return HTML.stringify(arg.childNodes)
    })
    .join('')
  }

  // Returns an array of nodes
  static parse(...args) {
    return html(HTML.stringify(args))
  }

}