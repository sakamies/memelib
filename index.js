
console.group("Memelib")
import { id, classes, form } from './memelib.js'
import { html } from './html.js' // Optional helper for parsing html.

//Let's make these global so you can play in devtools console. Just for fun, no need for any globals in prod.
window.id = id; window.classes = classes, window.form = form;

// Use whatever names you want.
//import { id as myid } from './memelib.js'

// Or import the whole class under some name.
//import { Meme as MyMeme } from './memelib.js'
// MyMeme.classes...



console.group('id')

// Check if element exists by id. Same as testing id.test1 to be truthy though.
console.log('element with id test1?', 'test1' in id)

// Get element by id.
console.log('id test1', id.test1)

// Replace contents with text, any type of node or an array of nodes.
id.test1 = 'Text content'

// Set innerHTML with your favourite way to parse html into nodes.
id.test2 = html('<b>HTML</b> content')

// Remove element.
delete id.removeme

console.groupEnd()





console.group('classes')

// Any elements with this class?
console.log('Any elements of class test?', 'test' in classes)

// Returns an array of elements of class, iterate with any class methods of course.
console.log('elements class test', classes.test)

// Set content as text or nodes, same as with id.
// Set per node text/html with a function.
classes.test = (node, i) => html('Test <b>' + (i+2) + '</b>')

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
console.groupEnd()



////////////////////////////////////////
//////////////////////////////////////////////////////////////
////////////////////////////////////////



console.group('Form')
import { element, value, tree, leaf, listen, ignore, change } from './form.js'

// Start with a particular form element.
// import { Form } from './form.js'
// const { value, tree, leaf, listen, ignore, change } = new Form(form.example)

//Let's make these global so you can play in devtools console.
window.value = value; window.tree = tree; window.leaf = leaf;





console.group('value')

// Get value of a form element. Same as form.elements.result.value.
console.log('value.result:', value.result)

//TODO: make length as name work
// console.log('value.result is', value.length)

// You can get value inside fieldsets too
// Same as scoped value like this: value(form.example.elements.fieldsettest).result
console.log('value.fieldsettest.result:', value.fieldsettest.result)

// Set value of a form element.
value.result = 0

// Set null to reset value to input.defaultValue.
value.result = null

// You can delete the whole node if needed.
// delete value.result

// Set a value in a fieldset.
value.fieldsettest.result

// Radios work the same as form.elements.radio.value = x
value.radios = 1

// You get checkbox value if checked, just like FormData does.
// Null if not checked.
console.log('unchecked checkbox returns null:', value.checkbox1)

// You set checkbox .checked property with truthy/falsy value.
// Use plain old DOM methods to change actual checkbox value property/attribute.
value.checkbox = true
console.log('checked checkbox returns value:', value.checkbox1)

// A checkbox with a fallback value for unchecked state is common
console.log('value.multicheck returns all:', value.multicheck)

// Get a specific checkbox by using its id
console.log('value["multicheck-one"], single checkbox by id:', value['multicheck-one'])

// There may be multiple inputs with the same name.
console.log('value.multi returns all:', value.multi)
// Set their values with an array.
value.multi = [3, 2, 1]
console.log('value.multi changed to:', value.multi)





console.group('tree & leaf')

// Get & set values named by object hierarchy.
tree.rows[0].sum = '400'
console.log('tree.rows[0].sum → rows[0][sum] value:', tree.rows[0].sum)

// Get & set leaves of object hierarchy.
classes.row.forEach((row, i) => {
  row = leaf(row) //Row is a fieldset, so let's scope leaf()
  row.sum = i * 300
  console.log(`row ${i} leaf sum:`, row.sum)
})

console.groupEnd()





console.group('listen, ignore, change')

// Listen for input & change events.
listen(value => {
  value.expression = parseInt(value.number) * 3 === 30
  if (value.expression === 'true') {
    value.result = '* 3 = 30'
  } else {
    value.result = '* 3 ≠ 30'
  }
})

// Listen to any type of events.
function goodMood(value) {value.mood = 'Bueno'}
listen('my-custom-event', goodMood)

// Ignore works exactly the same as listen, but removes event listeners.
ignore('my-custom-event', goodMood)

// Manually send change event after setting values.
value.result = 10
change()

// Set mutliple values and send a change event after the function is done.
batch(value => {
  value.number = 30
  value.number = 20
  value.number = 10
})

// Scopes work as usual.
// Param must be an HTMLFormElement, HTMLFieldSetElement or a string for document.forms[key]
value(form.example) // Get new value scoped to that form.
value(form.example.elements.fieldsettest) // You can also scope to fieldsets.
listen(form.example) // Get a new listen function for that form.
change(form.example) // Get a new change function for that form.

console.groupEnd()
console.groupEnd()