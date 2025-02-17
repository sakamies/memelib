# Memelib

I really like digging through all the native apis and using them with as little abstraction as possible. The DOM has just so much useful stuff built in that gets lost in history and behind libraries that abstract it all away. The two things that often that take some of the joy away are the historical baggage and verbosity. Both are out of necessity, so they're not some mistake. Just sometimes they get in the way of convenience.

Like the jQuerys and MooTools of old, I want a nice abstraction that's not too far from the native DOM, but is just that little bit nicer to use every day.

My goal here is to keep everything close to the DOM and easily explainable in terms of existing DOM apis. No large abstractions that feel like magic. I mean I like some magic stuff too sometimes, but my goal is not purely convenience or shortness of code. My ideal library would make it less intimidating to start making really simple interactive web pages, but still help you expand that simple knowledge you gained to be analogous to the underlying DOM apis. Most operations should be explainable in a way like "It's that, but like this".

So hopefully this will become a simple, analogous to existing apis and explainable DOM library for simple html pages.

First off, import all the parts, then on to the good stuff.

```js
import { id, classes, form } from './memelib.js'
```

Let's start simple. Every day I need to get elements with `document.getElementById('myid')`. For historical reasons, browsers add every id as a property on the window object. So `document.getElementById('myid')` there could also be `window.myid`. I love that! Not very safe though, because the window object has more than 200 properties in most browsers. You might get naming collisions and in those cases the built in properties win. So how about we import a little helper so we can do `id.myid` to safely get an element with id="myid".

Similar case for classes. The untold times of typing `element.querySelectorAll('.myclass')` or the oldschool `document.getElementsByClassName('myclass')`. Nothing wrong with those, but `classes.myclass` is a nice way to get an array of elements with that class. The property name can be anything that `document.getElementsByClassName` accepts as a parameter.

Now then, what's the most common operation you do with your nodes? For me it's setting some text content. Let's say you do `id.myid = 'text'` to set the `textContent` of that node. Setting `innerHTML` is almost as common, so let's do that with square brackets like `id.myid = ['<b>text</b>']`. I know that's an array, but I think it looks like a nice brick of html, so let's run. For classes you can of course set the contents of all matches the same way by doing `classes.myclass = 'text'`.

Often times I need to iterate over a bunch of elements and set their value. Let's loop and set values all in one by assigning a function. `classes.myclass = (node, i) => 'Node ' + i`. Exactly the same as `document.querySelectorAll('myclass').forEach((node, i) => node.textContent = 'Node ' + i)`, just a little shorter. Returning a string or an array from your callback function for textContent vs innerHTML works same as before.

Removing elements hasn't been that common for me, but let's make that more fun. I've always liked the `delete` keyword, but had very little use for it ever. `delete id.myid` calls the `element.remove()` method.

## Forms

Then there's forms. Most of my career I've used `querySelector` to get at forms, but forms have had a very similar super convenient and flexible property accessor type api as id's on `window` for ages. `document.forms.myform` gets you a form that either has `id="myform"` or `name="myform"`. A shortcut for that could be `form.myform`.

Let's use the delete keyword `delete form.myform` to reset the form.

Set a value to the to set the whole form state at once. `form.myform = [data here]`. Not quite sure how that data should be set yet. For individual values though, here comes the Form class.

Grab the parts and initialize with a form. There's quire a few, but they are simple, I promise!

```js
import { values, tree, leaf, listen, ignore, change, batch } from './form.js'
```

Values lets you get and set form values like the `id` helper up there. Get a value with `values.myinput`, which again is a shortcut for plain old DOM access via properties `document.forms.myform.elements.myinput.value`. So `myinput` here can be a name or id (or even the index) of the element you're after, like in the DOM.

You probably guessed setting values by now. Do `values.myinput = 'something'`. Form element values are always strings, so you'll need to do some `parseFloat` and stuff if you need to wrangle numbers and such. That's always been the case, so I'm not sure I'll include any automatic type coercion into this library. Some helpers might be nice though.

Usually you'll react somehow to user input or value changes on forms. That's why we have `listen`, `change` and `batch`. With `listen(values => values.myinput = 'My my')`, you can listen for changes on the form and do stuff when values change. Setting a value does not send a change event by default, so you should be safe from infinite event loops by default.

If you do want to edit a form value somewhere and react to it with `listen`, run `change()` to send a change event on your form. Event types and such are configurable of course, but let's leave that be for now.

More often though, you'll maybe want to set a bunch of values and make sure that you're not spamming change events. Use `batch(values => values.myinput = 1; values.myothervalue = 2;)` to send a single change event after you're done changing a bunch of values. Same as setting individual values and running `change()` after, but batch makes sure, regardless of configuration, that it won't spam change events while running.

Forms created from object hierarchies are funky. They have inputs with name attributes like `rows[0][sum]` or sometimes much deeper names. Could we navigate them by their object hierarchy like `tree.rows[0].sum`? Well we can! More often though you'll loop or otherwise be in the context of one row. So let's snatch a row and only handle its values with `leaf(rownode).sum = 123`.

-----

## Question I frequently ask myself

Is this a joke? Started out like on, but a definite no to that by now.

NPM module? Probably not. Not sure I want to be a maintainer.

Can I use this in production? The id, classes and form parts are probably simple enough that they're stable. Values etc for forms are a little more complex and still in flux.
