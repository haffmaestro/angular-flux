var app = angular.module('todoApp', ['ngFlux']).
  factory('TodoActions', TodoActions).
  factory('TodoConstants', TodoConstants).
  factory('TodoDispatcher', TodoDispatcher).
  factory('TodoStore', TodoStore).
  directive('todoList', todoList)


function TodoConstants(FluxUtil) {
  return FluxUtil.createActions([
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

    removeTodo: function(i) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.REMOVE_TODO,
        index: i
      });
    },

    completeTodo: function(i) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.COMPLETE_TODO,
        index: i
      });
    },

    incompleteTodo: function(i) {
      TodoDispatcher.handleViewAction({
        actionType: TodoConstants.INCOMPLETE_TODO,
        index: i
      });
    },
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
  var _todos = [];

  function _addItem(item) {
    _todos.push(item);
  }

  function _removeItem(i) {
    _todos.splice(i, 1);
  }

  function _completeItem(i) {
    _todos[i].completed = true;
  }

  function _incompleteItem(i) {
    _todos[i].completed = false;
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
          _removeItem(action.index);
          break;

        case TodoConstants.COMPLETE_TODO:
          _completeItem(action.index);
          break;

        case TodoConstants.INCOMPLETE_TODO:
          _incompleteItem(action.index);
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
      $scope.actions = TodoConstants;
      $scope.newTodo = {};

      $scope.createTodo = function() {
        TodoActions.addTodo(angular.copy($scope.newTodo));
        $scope.newTodo = {};
      };

      $scope.updateTodosFromStore = function() {
        $scope.todos = TodoStore.getTodos();
      }

      TodoStore.on('change', function() {
        $scope.updateTodosFromStore();
      });
    }
  }
}
