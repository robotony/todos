Todos = SC.Application.create({
	store: SC.Store.create().from('SC.Record.fixtures') 
});

Todos.Todo = SC.Record.extend({
  title: SC.Record.attr( String),
  isDone: SC.Record.attr( Boolean)
});

Todos.Todo.FIXTURES = [
	{
		guid: 1,
		title: "Tag1",
		isDone: false
	},
	{
		guid: 2,
		title: "Tag2",
		isDone: false
	}
];

Todos.ALL_QUERY = SC.Query.local(Todos.Todo, {
});

$(function() {
    var result = Todos.store.find(Todos.ALL_QUERY);
    Todos.todosController.set( 'content', result);
});

Todos.todosController = SC.ArrayProxy.create({
  content: [],

  createTodo: function(title) {
    // var todo = Todos.Todo.create({ title: title });
    // this.pushObject(todo);
    var todo = Todos.store.createRecord(Todos.Todo, {
      "title": title, 
      "isDone": false
    });
    Todos.store.commitRecords();		
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = SC.View.extend({
  remainingBinding: 'Todos.todosController.remaining',

  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
});

Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
    }
  }
});

