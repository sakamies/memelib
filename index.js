//
// Let's meme!
//
import { Meme } from './memelib.js'
// Use ids, classes, forms on their own, or use the whole class instance, up to you
const mememe = new Meme(document)
const { ids, classes, forms } = mememe
//



// ids
//
// Check if element exists by id. Same as testing ids.test1 to be truthy though
console.log('element with id test1?', 'test1' in ids)
//
// Get element by id
console.log('ids test1', ids.test1)
//
// Set textContent
ids.test1 = 'Text content'
//
// Set innerHTML with square brackets because it's heavier and square brackets look heavier
ids.test2 = ['<b>HTML</b> content']
//
// Remove element
delete ids.removeme
//
// Get a scoped instance. Look for ids inside that
const scoped = ids(ids.scope)
console.log('ids scoped', scoped.test1)
//



//
// classes
//
//
// Any elements with this class?
console.log('Any elements of class test?', 'test' in classes)
//
// Returns an array of elements of class
console.log('elements class test', classes.test)
//
// Scopable like ids
console.log('scoped classes', classes(ids.scope).test)
//
// Delete all elements of a class
delete classes.removeus
//



//
// forms
//
// Check if element exists
console.log('example form exists?', 'example' in forms)
//
// Get element by name, id, or index. Same as document.forms
console.log('form named example', forms.example)
//
// Set form values with FormData? Dunno how yet
// forms.example = [['key1', 'value'], ['key2', 'value']]
//
// Reset form
delete forms.example
//
// Scopable as usual.
console.log("there's no form inside scope", forms(ids.scope).example)
//



//
// form
//
import { Form } from './form.js'
//
const form = forms.example
const { values, listen, change, batch } = new Form(form) //Param is form id, name or form node
// If you only have one form in the document, calling new Form() without a parameter would choose that
//
// Send an event on every value modified?
new Form(forms.example, true)
//
// Maybe you need custom events?
new Form('example', new CustomEvent('my-custom-event'))
//
// Get value of a form element
console.log('values.numberout', values.numberout)
//
// Set value of a form element
values.numberout = 0
//
// Reset value
delete values.numberout
//
//
// Listen for input & change events
listen(values => {
  values.expression = parseInt(values.number) * 3 === 30
  if (values.expression === 'true') {
    values.numberout = '* 3 = 30'
  } else {
    values.numberout = '* 3 ≠ 30'
  }
})
//
// Set the events you want to listen to
listen('my-custom-event', (values) => {values.custom = 'Bueno'})
//
// Manually send change event after setting values
values.numberout = 10
change()
//
// Set mutliple values and send a change event after the function is done
batch(values => {
  values.number = 30
  values.number = 20
  values.number = 10
})
//
// Scopes work as usual
values(form) // get new values scoped to that form
batch(form) // get a new batch function for that form
listen(form) // get a new listener function for that form
change(form) // get a new change function for that form
//
//

