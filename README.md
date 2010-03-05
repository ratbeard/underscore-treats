Tasty plugins for the delicious underscore library.

flexyargs
=========

Shorthands to generate iterator functions for most of the common use cases of the collection methods.  Its like a souped up version of `_.pluck` for the following functions:

    any, all, map, detect, filter

    
The basic shorthand is to perform a `===` between a key and a value:

    _.any(dogs, 'name', 'leroy')  
    // generates an iterator that looks like:
    _.any(dogs, function (dog) { return dog.name === 'leroy'; })
    
    _.detect(dog, 'age', 5),
    _.detect(dog, function (dog) { return dog.age === 5; })
        
If you've got multiple key/values you want to check against, you can pass an object instead:

    _.filter(dogs, {age: 5, name: 'lily'})
    _.filter(dogs, function (dog) { return dog.age === 5 && dog.name == 'lily'; })
    
    
There's some special cases that are handled too.  

If you just a key (technically, if value is `undefined`), it will return the property at that key:

    _.map(dogs, 'name')
    _.map(dogs, function (dog) return dog.name; })
    // or the underscore provided shortcut:
    _.pluck(dogs, 'name')
    

If the key ends with `()`, it will invoke that function and use the result

    _.map(dogs, 'isYappy()')
    _.map(dogs, function (dog) { return dog.isYappy(); })
    

I've never needed to compare regular expression objects, but do often grep through a list of strings, so if value is a regex a string match iterator is built:

    _.all(dogs, 'name', /(a|e|i)/)
    _.all(dogs, function (dog) { return /(a|e|i)/.test(dog.name); })
    
    
By using `_.mixin()`, all these shorthands are available using a wrapper too:

    _.(dogs).all('name', /(a|e|i)/)

### Notes
You can still of course pass a normal iterator function in, which flexyargs will quickly pass through to the standard underscore extension.  No matter the case, if the native version of a collection method is available, it will be used!  

Only the methods listed above have the flexy magic, not `some`, `every` and other aliases.
