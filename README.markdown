## Angular with Flux Architecture

An attempt to try out the Flux architecture with Angular... check out
`demos/simple-todo/index.html` & `demos/simple-todo/todo-app.js` for to
see it in action.

`angular-flux.js` contains the pieces that you need to get going with
the Flux architecture in Angular. Just download it and include it in
your app with the module `ngFlux`.

- `FluxUtil` packages a couple of functions to reduce boilerplate
- `FluxUtil.defineConstants` defines constants for you, eg:
```javscript
app.factory('TodoConstants', function(FluxUtil) {
  return FluxUtil.defineConstants([
    'ADD_TODO', 'REMOVE_TODO', 'COMPLETE_TODO', 'INCOMPLETE_TODO',
    'UPDATE_TITLE', 'MARK_TODOS_COMPLETE', 'CLEAR_COMPLETED'
  ]);
}
```
- `FluxUtil.createDispatcher` creates a dispatcher from Facebook's
  `dispatcher.js` prototype and adds a `handleViewAction` function to
   it.
- `FluxUtil.createStore` creates an object based the node.js
  `EventEmitter` prototype, with a few useful helpers tacked on, such as
  `bindState(scope, callback)` that will add a change listener to the
  store and execute the callback on change - it also safely removes this
  listener when the scope is destroyed.
- The `localize-state` directive creates a one way data binding, so
  changes propagate down but not up, allowing you to keep the data in
  sync with wider application changes while controlling when the local
  state triggers an action.
