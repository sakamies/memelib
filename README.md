# Memelib

A thin convenience on top of native DOM element methods to get and set elements and their content.

Tries to make common operations super easy and nothing more. Many DOM element are already really nice, no need to fudge with them.

Sorry about the name. Started out as a joke but turned out actually useful.

To get started, put memelib.js in your project and import what you need.

```js
import { id, classes, form } from './memelib.js'
```

_The first commented out line in the code examples shows what's going on under the hood or how you'd do the same thing with plain old javascript._

## `id`

### Get element by id[^1]

```js
// document.getElementByID('simpleid')
id.simpleid
id['some-funky-id']
```

### Set element text content

```js
// document.getElementByID('simpleid').textContent = 'Some Text'
id.simpleid = 'Some text'
id['some-funky-id'] = 'Some funky text'
```

### Set html content

Assign an array to set innerHTML.[^2] The array can have any number of items, they are joined as one string of html.

```js
// document.getElementByID('simpleid').innerHTML = '<b>Some html</b>'
id.simpleid = ['<b>Some html</b>']
```

### Delete an element

```js
// document.getElementByID('simpleid').remove()
delete id.simpleid
```

### Check if an element exists

```js
// !!document.getElementByID('simpleid')
'simpleid' in id
```

## `classes`

### Get elements by class name

Returns an array of elements, so `map`, `filter` etc. array methods work straight away.

```js
// Array.from(document.getElementsByClassName('myclass'))
classes.myclass
classes['some-funky-class']
```

```js
for (node of classes.myclass) {...}
// Maybe filter out nodes without children or some such.
const nodesWithChildren = classes.myclass.filter(node => node.children.length)
```

### Set text content

Set text content of all elements that match your class.

```js
// document.getElementsByClassName('myclass').forEach(node => node.textContent = 'Some text')
classes.myclass = 'Some text'
```

### Set html content

Assign an array to set innerHTML.[^2] Can have any number of elements, they are joined as one string of html.

```js
// document.getElementsByClassName('myclass').forEach(node => node.innerHTML = '<b>Some html</b>')
classes.myclass = ['<b>Some html</b>']
```

### Set content of each match separately

Assign a function. The function will get run for each match. The function gets the current matched node and its index as parameters. Set text by returning a string, html by returning an array, just like when assigning a value directly.

```js
// document.getElementsByClassName('myclass').forEach((node, i) => node.innerHTML = `Match <b>${i}</b>`)
classes.myclass = (node, i) => [`Match <b>${i}</b>`]
```

### Delete an element

```js
// document.getElementsByClassName('myclass').forEach(node => node.remove())
delete classes.myclass
```

### Check if any elements that match exist

```js
// document.getElementsByClassName('myclass')?.length
'myclass' in classes
```

## `form`

### Get a named form

A named form is a `<form>` with an `id` or `name` attribute.

```js
// document.forms['example']
form.example
```

### Set form data

TODO: Populating the form with data is not yet implemented.

```js
TODO: form.example = [...]
```

Assign null to reset form.

```js
form.example = null
```

### Delete form

```js
delete form.example
```

### Check if a form exists

```js
'example' in form
```

-----

## TODO: Form class and its methods.

value, tree, leaf, listen, ignore, dispatch, batch

## value

TODO

-----

## Trivia

1. If you need this something's messed up already, but it will work anyway. Without any escaping!
    ```html
    <div id="123 any cazy ÅÄů ID will work!">
    ```
    ```js
    id['123 any cazy ÅÄů ID will work!']
    ```

2.  Classes uses `getElementsByClassName` internally, so you can get, set, check and delete elements that match multiple class names by adding a space between your class names. You'll get all elements with both classes.
    ```js
    classes['firstClass secondClass']
    ```

----

[^1]: This came about when I learned that [browsers make all ids top level properties on the window object](https://stackoverflow.com/questions/3434278/do-dom-tree-elements-with-ids-become-global-properties). I wanted a safe way to access ids like that.
[^2]: Square brackets look like brick and html feels like stacking bricks. So setting html is done by assigning with square brackets.