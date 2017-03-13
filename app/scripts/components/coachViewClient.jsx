var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;
var Todo = require('../models/models.js').Todo;
var TodoCollection = require('../models/models.js').TodoCollection;

require('materialize-sass-origin/js/collapsible.js');
require('materialize-sass-origin/js/jquery.easing.1.3.js');
require('materialize-sass-origin/js/date_picker/picker.date.js');


class CoachViewClient extends React.Component {
  constructor(props){
    super(props);

    console.log(this.props.id);
    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var clientTodos = new TodoCollection();

    this.addTodo = this.addTodo.bind(this);


    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      clientTodos = currentClient.todos;

      this.setState({
        currentClient: currentClient,
        clientCollection,
        clientTodos
      });
      console.log(clientCollection);
      console.log(currentClient);
    });

    this.state = {
      currentClient,
      clientCollection,
      clientTodos
    }

    console.log('todos', clientTodos);
  }
  addTodo(newTodo){

    this.state.clientTodos.create(newTodo, {success: () => {
      this.setState({clientTodos: this.state.clientTodos });
    }});
  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <h2>Client: {this.state.currentClient ? this.state.currentClient.get('username') : null}</h2>

          <div className="row">

            <ClientTodoList currentClient={this.state.currentClient}/>

          </div>

          <div className="row">
            <TodoForm clientTodos={this.state.clientTodos}
                      addTodo={this.addTodo}
            />
          </div>

        </div>

      </BaseLayout>
    )
  }
}



class ClientTodoList extends React.Component {
  constructor(props){
    super(props);

    var clientTodos = new TodoCollection();

    this.state = {
      currentClient: this.props.currentClient,
      clientTodos: clientTodos
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({currentClient: newProps.currentClient});

  }
  render(){
    var todoList = this.state.clientTodos.map(todo =>{
      return (

        <li key={client.cid}>
          <div className="collapsible-header"><input type="checkbox"/>{todo.get('title')}{todo.get('dueDate')}{todo.get('title')}</div>
          <div className="collapsible-body">
            {todo.get('notes')}
          </div>
        </li>
      )
    });


    return (


        <div className="col m8">
          <h3>Todos</h3>
            <ul className="collapsible" data-collapsible="accordion">
              {todoList}
            </ul>
        </div>

    )
  }
}

class TodoForm extends React.Component {
  constructor(props){
    super(props);

    this.handleTitle = this.handleTitle.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.addTodo = this.addTodo.bind(this);


    this.state = {
      todos: this.props.clientTodos,
      title: '',
      dueDate: '',
      notes: ''
    }
  }
  componentDidMount(){
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });
  }
  componentWillReceiveProps(newProps){
    this.setState({todos: newProps.clientTodos});
  }
  handleTitle(e){
    this.setState({title: e.target.value});
  }
  handleDate(e){
    this.setState({dueDate: e.target.value});
  }
  handleNotes(e){
    this.setState({notes: e.target.value});
  }
  addTodo(e){
    e.preventDefault();
    this.props.addTodo(this.state);
  }
  render(){
    return (
      <div className="col m8">
        <div className="row">
          <form onSubmit={this.addTodo}>
            <div>
              <input type="text" onChange={this.handleTitle} placeholder="What should I do?" />
              <input type="date" className="datepicker" placeholder="When is this due by?" onChange={this.handleDate}/>

                <div className="row">
                  <div className="input-field">
                    <textarea id="textarea1" className="materialize-textarea" onChange={this.handleNotes}></textarea>
                    <label htmlFor="textarea1">Any notes for your client?</label>
                      <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                        <i className="material-icons right">send</i>
                      </button>
                  </div>
                </div>

            </div>
          </form>
        </div>
      </div>
    )
  }
}

module.exports = {
  CoachViewClient
};
