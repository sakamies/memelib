# Memelib

A thin convenience on top of native DOM element methods to get and set elements and their content.

Tries to make common operations super easy and nothing more. Assumes you already know your way around DOM manipulation. Many DOM element are really nice, no need to fudge with them, just some helpers to write and read less code, hopefully without sacrificing understandability.

Sorry about the name. Started out as a joke but turned out actually useful.

To get started, put memelib.js in your project and import what you need.

TODO: add a short example on the different ways to import these methods and custom name imports.

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

# Form

The form class is very similar to the main Memelib class. It's a separate thing because it's really meant to work only with form and fieldset nodes and the inputs in those, not for general dom get/set operations.

Start with the imports.

```js
import { value, tree, leaf, listen, ignore, change, batch } from './form.js'
```

By default, all these methods are scoped to the first form on the page, so if you have only one form, they're easy to start with. You can scope any of them to your desired form or fieldset by invoking the method with the form or fieldset as a parameter.

```js
const scopedValue = value(form.example); console.log(scopedValue.inputname);
const scopedTree = tree(form.example)
const scopedLead = leaf(value(form.example).fieldsetname)
//listen, ignore, change, batch work the same way
```

You can initialize everything in one go to your form or fieldset.

```js
import Form from './form.js'
const { value, tree, leaf, listen, ignore, change, batch } = new Form(form.example)
```

## value

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

## leaf

Leaf is for working with the leaf nodes of your inputs that are based on an object hierarchy. Imagine you have a bunch of rows that have `name="rows[0][sum]"` like in the example above. You might loop through them, or respond to an event coming from a single row. Scope the `leaf` method to your desired row and access the sum directly, without needing to write out the whole path to the sum.

So here the `row.sum` is the same as `tree.rows[i].sum`. This is a rather simple example, often the object hierarchies are a little deeper.

```js
classes.row.forEach((row, i) => {
  row = leaf(row) //Row is a fieldset, so let's scope leaf()
  row.sum = i * 300
  console.log(`row ${i} leaf sum:`, row.sum)
})
```

## listen

Listen for input & change events on your form or fieldset. The given callback will get an instance of value as its parameter. That value will have the same form scope as the listen function.

```js
// document.forms[0].addEventListener('change', e => e.form.elements.inputname.value = 200)
// document.forms[0].addEventListener('input', e => e.form.elements.inputname.value = 200)
listen(value => value.inputname = 200)
```

Give any number of strings or functions to react to events in any way you need. This example reacts to these two events, and either event firing will run both functions. Then react to a third event with another function.

```js
listen('change', 'custom-event', updateSomeValues, updateOtherValues)
listen('third-event', evenMoreUpdates)
```

## ignore

TODO: ignore should work just like removeEventListener

## change

Dispatch a change event on your form. Useful if you want to update just one value somewhere and trigger your listeners right after.

```js
//document.forms[0].dispatchEvent(new Event('change', {bubbles: true}))
change()
```

## batch

Set mutliple values and send a change event after the function is done. Same as calling `change()` once after setting multiple values.

```js
batch(value => {
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
[^2]: Square brackets look like brick and html feels like stacking bricks. So setting html is done by assigning with square brackets.