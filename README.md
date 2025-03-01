# Memelib

A thin convenience on top of native DOM element methods to get and set elements and their content.

About 12k as source with comments, maybe 1.5k compressed.

Tries to make common operations super easy and nothing more. Assumes you know your way around DOM manipulation. Many DOM element APIs are already really nice, no need to fudge with them, just some helpers to write and read less code, hopefully without sacrificing understandability. Real easy to ditch and replace with native DOM code if you need to migrate away.

Sorry about the name. Started out as a joke but turned out actually useful.

To get started, put memelib.js in your project and import what you need.

```js
import { id, classes, form, html } from './memelib.js'
```

<details>
<summary>A brief tutorial on imports & objects</summary>

You can use whatever names you want by using the `as` keyword.

```
import { id as myid } from './memelib.js'
```

Now you'd use `myid` instead of `id` in your code.

If you feel it's cleaner to have all the methods under one namespace, you can import the whole class and name it whatever you like.

```
import { Meme as MyMeme } from './memelib.js'
```

`MyMeme` will have `id`, `classes` and `form` as methods.

</details>

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

Set the html content of your node by assinging a node, an array or nodes or by assigning some html `element.innerHTML`.

```js
// document.getElementByID('simpleid').replaceChildren(node1, node2, etc...)
id.simpleid = node
id.simpleid = [node1, node2, etc...]
```

```js
// document.getElementByID('simpleid').innerHTML = '<b>Some html</b>'
id.simpleid.innerHTML = '<b>Some html</b>'
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
// Array.from(document.getElementsByClassName('someclass'))
classes.someclass
classes['some-funky-class']
```

```js
for (node of classes.someclass) {...}
// Maybe filter out nodes without children or some such.
const nodesWithChildren = classes.someclass.filter(node => node.children.length)
```

### Set text content

Works the same as assinging content to `id.someid`, but assigns the same content to all elements of the class.

```js
// document.getElementsByClassName('someclass').forEach(node => node.textContent = 'Some text')
classes.someclass = 'Some text'
```

### Set html content

```js
// document.getElementsByClassName('someclass').forEach(node => node.replaceChildren(node1, node2, etc...))
classes.someclass = node
classes.someclass = [node1, node2, etc...]
```

### Set content of each found element separately

Assign a function. The function will get run for each element of the class. The function gets the current element, its index and all elements of the class as parameters. (Same as array forEach) The return value will be set on the node. Returning a string sets textContent and returning a node or an array of nodes sets html content.

If you want to set innerHTML with a string, you could loop over the elements, but then there's also this handy `html()` function in html.js that will parse any html into an array of nodes.

```js
// document.getElementsByClassName('someclass').forEach((node, i, nodes) => node.innerHTML = `Element <b>${i}</b>`)
classes.someclass = (node, i, nodes) => html(`Element <b>${i}</b>`)
```

### Delete an element

```js
// document.getElementsByClassName('someclass').forEach(node => node.remove())
delete classes.someclass
```

### Check if any elements of a class exist

```js
// document.getElementsByClassName('someclass')?.length
'someclass' in classes
```

## `form`

### Get a named form

A named form is a `<form>` with an `id` or `name` attribute.

```js
// document.forms['example']
form.example
```

### Set form data

Assign null to reset form. Use Form class below to set values on a form.

```js
form.example = null
```

Might implement some FormData-like way to set the whole form at once here, but haven't figured that out yet.

### Delete form

```js
delete form.example
```

### Check if a form exists

```js
'example' in form
```

-----

# Form

The form class is very similar to the main Memelib class. It's a separate thing because it's really meant to work only with form and fieldset nodes and the inputs in those, not for general dom get/set operations.

Start with the imports.

```js
import { element, value, tree, leaf, listen, ignore, change } from './form.js'
```

By default, all these methods are scoped to the first form on the page, so if you have only one form, they're easy to start with. You can scope any of them to your desired form or fieldset by invoking the method with the form or fieldset as a parameter.

```js
const scopedValue = value(form.example); console.log(scopedValue.inputname);
const scopedTree = tree(form.example)
const scopedLead = leaf(value(form.example).fieldsetname)
//listen, ignore, change work the same way
```

You can initialize everything in one go to your form or fieldset.

```js
import { Form } from './form.js'
const { element, value, tree, leaf, listen, ignore, change } = new Form(form.example)
```

## `element`

TODO: write this

## `value`

`value` works by using [HTMLFormElement: elements property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements) internally, so you can access elements by their id or name with `value´.

If there are multiple form elements that match what you're trying to get (like checkboxes with the same name attribute), `value` will return an array or all their values.

For fieldsets, `value` will return a new instance of `value` scoped to that fieldset, so you can traverse into fieldsets if needed.

### Get value of a form element

```js
// document.forms[0].elements.inputname.value
value.inputname
```

- Radios teturn the value of the checked radio.
- Checkboxes return true/false based on their checked state.
- Fieldsets return a new value instance scoped to that fieldset. Nice, but not strictly ever necessary because all the form elements will be available in `value` already.
- Output elements return their value.

```js
// document.forms[0].elements.fieldsetname.elements.inputname.value
value.fieldsetname.inputname
```

### Set value of a form element

```js
// document.forms[0].elements.inputname.value = 'Some value'
value.inputname = 'Some value'
```

- For radios, if a radio matches the given value, that radio will become checked.
- For checkboxes, set them to checked with a truthy value. Falsy will uncheck.
- Output element values can also be set, since they are form elements.

### Reset value of a form element
```js
// document.forms[0].elements.inputname.value = document.forms[0].elements.inputname.defaultValue
value.inputname = null
```

### Delete form element

```js
// document.forms[0].elements.inputname.remove()
delete value.inputname
```

## tree

`tree` is for working with inputs that have their names based on an object hierarhy. Like `name="rows[0][sum]"` which would correspond to an array of row objects, each having a sum property. Like `rows = [{sum: 'value'}, {sum: 'value'}]`

You access the inputs like you would access the object hierarchy in normally.

```js
tree.rows[0].sum
tree.rows[0].sum = '400'
delete tree.rows[0].sum
```

The logic for setting and getting different types of inputs is exactly the same as with using the `value` method.

## `leaf`

Leaf is for working with the leaf nodes of your inputs that are based on an object hierarchy. Imagine you have a bunch of rows that have `name="rows[0][sum]"` like in the example above. You might loop through them, or respond to an event coming from a single row. Scope the `leaf` method to your desired row and access the sum directly, without needing to write out the whole path to the sum.

So here the `row.sum` is the same as `tree.rows[i].sum`. This is a rather simple example, often the object hierarchies are a little deeper.

```js
classes.row.forEach((row, i) => {
  row = leaf(row) //Row is a fieldset, so let's scope leaf()
  row.sum = i * 300
  console.log(`row ${i} leaf sum:`, row.sum)
})
```

## `listen`

Listen for click, input & change events on your form or fieldset.

```js
// document.forms[0].addEventListener('click', event => ...)
// document.forms[0].addEventListener('input', event => ...)
// document.forms[0].addEventListener('change', event => ...)
listen(event => value.isthebutton = event.target === elements.buttonname)
```

There's a bunch of ways to set up listeners. Mixed parameters of event names and functions will have all given functions react to all given event names.

```js
listen('click', clickHandler)
listen('submit', submitHandler)
listen('my-event', 'some-other-event', doCustomStuff, andMoreCustomStuff)
```

Does not support setting options on event listeners. Options are rarely needed, so if you need to set them, use the normal `element.addEventListener(type, listener, options)` method.

## `ignore`

Work as the opposite of listen, just like removeEventListener.

```js
// document.forms[0].addEventListener('change', updateSomeValues)
// document.forms[0].addEventListener('input', updateSomeValues)
listen(updateSomeValues)
// document.forms[0].removeEventListener('change', updateSomeValues)
// document.forms[0].removeEventListener('input', updateSomeValues)
ignore(updateSomeValues)
```

## `change`

Emit a change event on your form. Useful if you want to update just one value somewhere and trigger your listeners right after.

```js
//document.forms[0].dispatchEvent(new Event('change', {bubbles: true}))
change()
```

Set mutliple values and emit a change event after the function is done by using a callback. Same as calling `change()` once after setting multiple values.

```js
change(() => {
  value.numberone = 11
  value.numbertwo = 22
})
```

----

# Trivia

1. If you need this something's messed up already, but it will work anyway. Without any escaping!
    ```html
    <div id="123 any ÅÄů ID will work!">
    ```
    ```js
    const strangenode = id['123 any ÅÄů ID will work!']
    ```

2.  Classes uses `getElementsByClassName` internally, so you can get, set, check and delete elements that match multiple class names by adding a space between your class names. You'll get all elements with both classes.
    ```js
    classes['firstClass secondClass']
    ```

----

[^1]: This came about when I learned that [browsers make all ids top level properties on the window object](https://stackoverflow.com/questions/3434278/do-dom-tree-elements-with-ids-become-global-properties). I wanted a safe way to access ids like that.