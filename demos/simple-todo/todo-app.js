var app = angular.module('todoApp', ['ngFlux']).
  factory('TodoActions', TodoActions).
  factory('TodoConstants', TodoConstants).
  factory('TodoDispatcher', TodoDispatcher).
  factory('TodoStore', TodoStore).
  directive('todoList', todoList).
  directive('todoListItem', todoListItem).
  directive('rawTodoData', rawTodoData)


function TodoConstants(FluxUtil) {
  return FluxUtil.defineConstants([
    'ADD_TODO', 'REMOVE_TODO', 'COMPLETE_TODO', 'INCOMPLETE_TODO'
  ]);
}

function TodoActions(TodoConstants, TodoDispatcher) {
  return {
    addTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.ADD_TODO,
        item: item
      });
    },

    removeTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.REMOVE_TODO,
        item: item
      });
    },

    completeTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.COMPLETE_TODO,
        item: item
      });
    },

    incompleteTodo: function(item) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.INCOMPLETE_TODO,
        item: item
      });
    }
  }
}

function TodoDispatcher(FluxUtil) {
  return FluxUtil.createDispatcher({
    handleViewAction: function(action) {
      this.dispatch({
        source: 'VIEW_ACTION',
        action: action
      })
    }
  });
}

function TodoStore(TodoDispatcher, TodoConstants, FluxUtil) {
  var _todos = [],
      _id = 0;

  function _addItem(item) {
    _id++;
    item.id = _id;
    _todos.push(item);
  }

  function _removeItem(item) {
    var index = _todos.indexOf(item);
    _todos.splice(index, 1);
  }

  function _completeItem(item) {
    var index = _todos.indexOf(item);
    _todos[index].complete = true;
  }

  function _incompleteItem(item) {
    var index = _todos.indexOf(item);
    _todos[index].complete = false;
  }

  var store = FluxUtil.createStore({
    getTodos: function() {
      return _todos;
    },

    dispatcherIndex: TodoDispatcher.register(function(payload) {
      var action = payload.action;

      switch(action.actionType) {
        case TodoConstants.ADD_TODO:
          _addItem(action.item);
          break;

        case TodoConstants.REMOVE_TODO:
          _removeItem(action.item);
          break;

        case TodoConstants.COMPLETE_TODO:
          _completeItem(action.item);
          break;

        case TodoConstants.INCOMPLETE_TODO:
          _incompleteItem(action.item);
          break;
      }

      store.emitChange();

      return true;
    })
  });

  return store;
}

function todoList(TodoActions, TodoStore) {
  return {
    restrict: 'E',
    templateUrl: "todo-list.html",
    controller: function($scope) {
      $scope.newTodo = {};

      $scope.createTodo = function() {
        TodoActions.addTodo(angular.copy($scope.newTodo));
        $scope.newTodo = {};
      };

      TodoStore.bindState($scope, function updateTodosFromStore() {
        $scope.todos = TodoStore.getTodos();
      });
    }
  }
}

function todoListItem(TodoActions) {
  return {
    restrict: 'E',
    scope: {todo: '='},
    templateUrl: "todo-list-item.html",
    controller: function($scope) {
      $scope.removeTodo = function() {
        TodoActions.removeTodo($scope.todo);
      }

      $scope.toggleComplete = function() {
        if ($scope.todo.complete) {
          TodoActions.incompleteTodo($scope.todo);
        } else {
          TodoActions.completeTodo($scope.todo);
        }
      }
    }
  }
}

function rawTodoData(TodoStore) {
  return {
    restrict: 'E',
    templateUrl: "raw-todo-data.html",
    controller: function($scope) {
      TodoStore.bindState($scope, function updateTodosFromStore() {
        $scope.todos = TodoStore.getTodos();
      });
    }
  }
}
