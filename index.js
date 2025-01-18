//
console.group("Let's meme!")
import { id, classes, form } from './memelib.js'
//
// Use whatever names you want by destructuring
//import { id: myid } from './memelib.js'
//
console.groupEnd()



console.group('id')
//
// Check if element exists by id. Same as testing id.test1 to be truthy though
console.log('element with id test1?', 'test1' in id)
//
// Get element by id
console.log('id test1', id.test1)
//
// Set textContent
id.test1 = 'Text content'
//
// Set innerHTML with square brackets because it's heavier and square brackets look heavier
id.test2 = ['<b>HTML</b> content']
//
// Remove element
delete id.removeme
//
console.groupEnd()





console.group('classes')
//
// Any elements with this class?
console.log('Any elements of class test?', 'test' in classes)
//
// Returns an array of elements of class
console.log('elements class test', classes.test)
//
// Set text as string, or html with angle brackets like id.
// Set per node text/html with a function.
classes.test = (node, i) => ['Test <b>' + (i+2) + '</b>']
//
// Only look for classes inside scope.
const scopedClasses = classes(id.scope)
console.log('scoped classes', scopedClasses.test)
//
// Delete all elements of a class
delete classes.removeus
//
console.groupEnd()





console.group('form')
//
// Check if element exists
console.log('example form exists?', 'example' in form)
//
// Get element by name, id, or index. Same as document.forms
console.log('form named example', form.example)
//
// TODO: Set form values with FormData? Dunno how yet
// form.example = [['key1', 'value'], ['key2', 'value']]
//
// Reset form
delete form.example
//
console.groupEnd()





console.group('Form')
//
import { Form } from './form.js'
//
const { values, listen, change, batch } = new Form(form.example.elements.set) //Param is whatever document.forms[key] accepts as key, an HTMLFormElement, or an HTMLFieldSetElement.
// If you only have one form in the document, calling new Form() without a parameter would choose that
//
// Send an event on every value modified?
const { values: chattyvalues } = new Form(form.example, true)
//
// Maybe you need custom events?
const { values: eventfulvalues } = new Form('example', new CustomEvent('my-custom-event'))
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
values(form.example) // get new values scoped to that form
batch(form.example) // get a new batch function for that form
listen(form.example) // get a new listener function for that form
change(form.example) // get a new change function for that form
//
console.groupEnd()