//
// Let's meme!
//
import { Meme } from './memelib.js'
let {ids, classes, forms} = new Meme(document)

// Apply scope
ids = ids(document)

// Get element by id
console.log('ids', {test: ids.test1})

// Set textContent of element with test1 id.
ids.test1 = 'Text content'

// innerHTML is set with square brackets because it's a heavier operation and square brackets look heavier.
ids.test2 = ['<b>HTML</b> content']

// Same as document.getElementById('deleteme').remove()
delete ids.deleteme



// Classes returns an array of elements with this class
console.log('classes', classes.test)



import { Form } from './form.js'
const form = forms.example //If you only have one form in the document, calling new Form() would choose that, but I want to be explicit here
const {values, batch} = new Form(form) //Pass in form id, name or form node to set scope.
// Want to send an event on every value modified? Set second param to true of your custom event.
//new Form(form, true|new CustomEvent(...))
//values = values(form) to get new values scoped to that form
//batch = batch(form) to get a new batch function for that form

form.addEventListener('input', () => {
  values.expression = parseInt(values.number) * 3 === 30
  values.numberout = '* 3 = ' + values.expression
})

//Modify mutliple values and send a change event on form only after running.
batch(values => {
  values.number = 20
  values.expressiontest = parseInt(values.number) * 3 === 30
})

