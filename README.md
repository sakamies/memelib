# My very own meme library

Get, set and manipulate elements and forms super easy.

I just learned a lot of javascript and now I want to use all its power. Really I just want to do basic dom stuff in a nicer way. Like the jQuerys and MooTools of old.

```
const { ids, classes, forms } = new Meme(document)
ids.test1 = 'Set text content by assignment'
delete ids.removeme // I always liked the delete operator
const tests = classes.test // Array of elements that have class "test"
delete classes.tests // All gone!
forms.example // document.forms.example shortcut

// And boom!
const { values, listen, change, batch } = new Form(forms.example)
values.number = parseInt(values.number) * 2 // Get & set form element values
```

Check example usage in `index.html` and `index.js`.

## Question I frequently ask myself

Is this a joke? Dunno. Feels nice and actually useful though.

NPM module? Probably not. Not sure I want to be a maintainer.

Can I use this in production? I think I will, you probably shouldn't trust this though.