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


    var clientId = this.props.id;

    console.log(clientId);

    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      this.setState({
        currentClient: currentClient,
        clientCollection
      });
      console.log(clientCollection);
      console.log(currentClient);
    });

    clientTodos.parseWhere(
      'owner', '_User', clientId
    ).fetch().then(() => {
      this.setState({clientTodos: clientTodos});
    });

    this.state = {
      currentClient,
      clientCollection,
      clientTodos,
      clientId
    };

    this.addTodo = this.addTodo.bind(this);
    // this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

  }
  // componentWillReceiveProps(newProps){
  //
  //
  //   console.log('these todos',this.state.clientTodos);
  // }
  addTodo(newTodo){


    //
    // var newTodoItem = new Todo(newTodo);

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

            <ClientTodoList currentClient={this.state.currentClient}
            clientTodos={this.state.clientTodos}
            />

          </div>

          <div className="row">
            <TodoForm clientTodos={this.state.clientTodos}
                      addTodo={this.addTodo}
                      clientId={this.state.clientId}
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

    var clientTodos = this.props.clientTodos;

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

    console.log('id in form', this.props.clientId);

    var clientId = this.props.clientId;


    this.state = {
      title: '',
      dueDate: '',
      notes: '',
      clientId: '',
      owner: {"__type": "Pointer", "className": "_User", "objectId": clientId},

    }
  }
  componentDidMount(){
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      formatSubmit: 'd/mmm/yyyy'
    });
  }
  componentWillReceiveProps(newProps){
    this.setState({clientId: newProps.clientId});

  }
  handleTitle(e){
    this.setState({title: e.target.value});
  }
  handleDate(e){
    console.log('date',this.state.dueDate);
    this.setState({dueDate: e.target.value});
  }
  handleNotes(e){
    this.setState({notes: e.target.value});
  }
  addTodo(e){
    e.preventDefault();
    this.props.addTodo(this.state);
    this.setState({title: '', dueDate:'', notes: ''});
  }
  render(){
    return (
      <div className="col m8">
        <div className="row">
          <form onSubmit={this.addTodo}>
            <div>
              <input type="text" onChange={this.handleTitle} placeholder="What should I do?" value={this.state.title}/>
              <input type="date" className="datepicker" placeholder="When is this due by?" onChange={this.handleDate} />

                <div className="row">
                  <div className="input-field">
                    <textarea id="textarea1" className="materialize-textarea" onChange={this.handleNotes} data-value={this.state.notes}></textarea>
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
