# whiskify

Utility class to help running JavaScript functions as [OpenWhisk](https://github.com/openwhisk/openwhisk) Actions.

## why?

"Serverless" cloud platforms let us create simple "microservices" from JavaScript functions.

This library helps you convert normal JavaScript functions to ephemeral "microservices" and interact with them as local functions. 

We can now choose to move computations from the local machine to a scalable cloud platform with minimal code changes.

## installation

```
npm install whiskify
```

## usage

```
const whiskify = require('whiskify')({api: 'https://', api_key: '...', namespace: '...'})
const action = whiskify(function (item) { return i + 1; })

action(1).then(function (result) {
  // == 2
})

action.map([1, 2, 3, 4]).then(function (result) {
 // == [2, 3, 4, 5]
})

action.delete() 
```

## limitations

OpenWhisk Actions execute using NodeJS v0.12, functions must not use features not available on this platform, e.g. arrow functions. Functions must not reference variables defined outside the function definition. 
