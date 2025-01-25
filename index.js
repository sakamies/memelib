
console.group("Let's meme!")
import { id, classes, form } from './memelib.js'

// Use whatever names you want by destructuring.
//import { id: myid } from './memelib.js'

console.groupEnd()



console.group('id')

// Check if element exists by id. Same as testing id.test1 to be truthy though.
console.log('element with id test1?', 'test1' in id)

// Get element by id.
console.log('id test1', id.test1)

// Set textContent.
id.test1 = 'Text content'

// Set innerHTML with square brackets because it's heavier and square brackets look heavier.
id.test2 = ['<b>HTML</b> content']

// Remove element.
delete id.removeme

console.groupEnd()





console.group('classes')

// Any elements with this class?
console.log('Any elements of class test?', 'test' in classes)

// Returns an array of elements of class, iterate with any class methods of course.
console.log('elements class test', classes.test)

// Set text as string, or html with angle brackets like id.
// Set per node text/html with a function.
classes.test = (node, i) => ['Test <b>' + (i+2) + '</b>']

// Only look for classes inside scope.
const scopedClasses = classes(id.scope)
console.log('scoped classes', scopedClasses.test)

// Delete all elements of a class.
delete classes.removeus

console.groupEnd()





console.group('form')

// Check if element exists.
console.log('example form exists?', 'example' in form)

// Get element by name, id, or index. Same as document.forms.example.
console.log('form named example', form.example)

// TODO: Set form values with FormData? Dunno how yet
// form.example = [['key1', 'value'], ['key2', 'value']]

// Reset form by setting null
// form.example = null

// Delete whole form
// delete form.example

console.groupEnd()





console.group('Form')

import { Form } from './form.js'
const { values, tree, leaf, listen, ignore, dispatch, batch } = new Form()
//Param to Form class is HTMLFormElement, HTMLFieldSetElement or whatever document.forms[key] accepts as key, same applies when scoping any of the Form methods.
// If you only have one form in the document, calling new Form() without a parameter chooses that.

// Get value of a form element. Same as form.elements.result.value.
console.log('values.result', values.result)

// A fieldset gives you a new values() scoped to that fieldset.
console.log('values.fieldsettest.number', values.fieldsettest.result)

// Set value of a form element.
values.result = 0

// Set null to reset value to input.defaultValue.
values.result = null

// Set a value in a fieldset.
values.fieldsettest.result

// For checkboxes, you get the value if the checkbox is checked, just like FormData does.
// But you set checkbox checked state, not value.
console.log('unchecked checkbox returns null', values.checkbox1)
values.checkbox1 = true
console.log('checked checkbox returns value', values.checkbox1)

// Delete whole input.
// delete values.result

// Get & set values named by object hierarchy.
tree.rows[0].sum = '400'
console.log('rows[0][sum]', tree.rows[0].sum)

// Get & set leaves of object hierarchy.
classes.row.forEach((row, i) => {
  row = leaf(row) //Row is a fieldset, so let's scope leaf()
  row.sum = i * 300
  console.log(`row ${i} > ........[sum]`, row.sum)
})

// Listen for input & change events.
listen(values => {
  values.expression = parseInt(values.number) * 3 === 30
  if (values.expression === 'true') {
    values.result = '* 3 = 30'
  } else {
    values.result = '* 3 ≠ 30'
  }
})

// Set the events you want to listen to.
listen('my-custom-event', (values) => {values.mood = 'Bueno'})

// Manually send change event after setting values.
values.result = 10
dispatch()

// Set mutliple values and send a change event after the function is done.
batch(values => {
  values.number = 30
  values.number = 20
  values.number = 10
})

// Scopes work as usual.
values(form.example) // Get new values scoped to that form.
values(form.example.elements.fieldsettest) // You can also scope to fieldsets.
batch(form.example) // Get a new batch function for that form.
listen(form.example) // Get a new listen function for that form.
dispatch(form.example) // Get a new dispatch function for that form.

console.groupEnd()
