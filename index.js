//
// Let's meme!
//
import { Meme } from './memelib.js'
let { ids, classes, forms } = new Meme(document)
// Use ids, classes, forms on their own, or use the whole class instance, up to you.
// let mememe = new Meme(document); mememe.ids.test1; etc...
//
//
// ids
//
// Check if element exists by id
console.log('element with id test1?', 'test1' in ids)
//
// Get element by id
console.log('ids', { test: ids.test1 })
//
// Set textContent.
ids.test1 = 'Text content'
//
// Set innerHTML with square brackets because it's heavier and square brackets look heavier.
ids.test2 = ['<b>HTML</b> content']
//
// Remove element
delete ids.removeme
//
// Get a scoped instance. Look for ids inside that.
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
console.log('classes', classes.test)
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
console.log('forms', { example: forms.example })
//
// Set form values with FormData? Dunno how yet.
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
const { values, batch, listen } = new Form(form) //Param is form id, name or form node
// If you only have one form in the document, calling new Form() without a parameter would choose that.
//
// Send an event on every value modified
// new Form(form, true)
//
// Maybe you need custom events?
// new Form(form, new CustomEvent(...))
//
// Scopes work as usual
// values = values(form) to get new values scoped to that form
// batch = batch(form) to get a new batch function for that form
// batch = listen(form) to get a new batch function for that form

values.numberout = '123'

// String params are events to listen to, function params are callbacks to run
// listen('my-custom-event', (values) => {values.something = 'Bueno'})
// Defaults to change & input events.
//
listen(values => {
  values.expression = parseInt(values.number) * 3 === 30
  if (values.expression === 'true') {
    values.numberout = '* 3 = 30'
  } else {
    values.numberout = '* 3 ≠ 30'
  }
})

// Modify a single value

//Modify mutliple values and send a change event on form only after running.
batch(values => {
  console.log('batch run')
  values.number = 20
})

