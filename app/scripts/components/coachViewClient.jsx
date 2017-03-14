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

    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var clientTodos = new TodoCollection();
    var currentTodos = new TodoCollection();

    var clientId = this.props.id;

    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      this.setState({
        currentClient: currentClient,
        clientCollection
      });

    });


    // parseWhere didn't seem to get the job done, but this defnitely does

      clientTodos.fetch().then(() => {
        clientTodos = clientTodos.where({clientId: this.props.id});

        // if (clientTodos === []) {
        //   this.setState({
        //     clientTodos: new TodoCollection()
        //   });
        // }else {
          this.setState({
            currentTodos: clientTodos
          });
        // }

      });

    // clientTodos.parseWhere(
    //   'owner', '_User', this.props.id
    // ).fetch().then(() => {
    //   this.setState({clientTodos: clientTodos});
    // });

    this.state = {
      currentClient,
      clientCollection,
      clientTodos,
      currentTodos,
      clientId
    };

    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);

  }
  addTodo(newTodo){

    this.state.clientTodos.create(newTodo, {success: () => {

      this.state.clientTodos.fetch().then(() => {
        var updatedTodo = this.state.clientTodos.where({clientId: this.props.id});
          this.setState({
            currentTodos: updatedTodo
          });

      });
      // this.setState({currentTodos: this.state.clientTodos });
    }});

    // this.state.clientTodos.fetch().then(() => {
    //   var updatedTodo = this.state.clientTodos.where({clientId: this.props.id});
    //     this.setState({
    //       currentTodos: updatedTodo
    //     });
    //
    // });
  }
  deleteTodo(todo){
    console.log('clicked!');
    todo.destroy({success: () =>{

      this.state.clientTodos.fetch().then(() => {
        var updatedTodo = this.state.clientTodos.where({clientId: this.props.id});
          this.setState({
            currentTodos: updatedTodo
          });

      });

    }});

  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <h2>Client: {this.state.currentClient ? this.state.currentClient.get('username') : null}</h2>

          <div className="row">

            <ClientTodoList currentClient={this.state.currentClient}
            currentTodos={this.state.currentTodos}
            deleteTodo={this.deleteTodo}
            />

          </div>

          <div className="row">
            <TodoForm currentTodos={this.state.currentTodos}
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

    var currentTodos = this.props.currentTodos;

    console.log('todos in list', this.props.currentTodos);

    this.state = {
      currentClient: this.props.currentClient,
      currentTodos: currentTodos
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({currentTodos: newProps.currentTodos});

  }
  componentDidMount(){

    $('.collapsible').collapsible();

  }
  render(){
    var todoList = this.state.currentTodos.map(todo =>{
      return (

        <li key={todo.cid}>
          <div className="collapsible-header"><input type="checkbox"/>{todo.get('title')}{todo.get('dueDate')}

            {todo.get('isComplete') ? <span>
              <i className="material-icons">check_circle</i>
            </span>
            : null }

          </div>
          <div className="collapsible-body">
            {todo.get('notes')}

            <a className="btn-floating btn-small waves-effect waves-light red" onClick={(e) => {
                event.preventDefault();
            this.props.deleteTodo(todo);}}>
            <i className="material-icons">close</i>
            </a>

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
      formatSubmit: 'd/mmm/yyyy',
      hiddenName: true,
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });
  }
  componentWillReceiveProps(newProps){
    this.setState({clientId: newProps.clientId});

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
    this.setState({title: '', dueDate:'', notes: ''});
  }
  render(){
    return (
      <div className="col m8">
        <div className="row">
          <form onSubmit={this.addTodo}>
            <div>
              <input type="text" onChange={this.handleTitle} placeholder="What should I do?" value={this.state.title}/>

              <input name="date_input" type="date" className="datepicker" placeholder="When is this due by?"  />

              <input type="hidden" name="date_input"  onChange={this.handleDate} />

                <div className="row">
                  <div className="input-field">
                    <textarea id="textarea1" className="materialize-textarea" onChange={this.handleNotes} value={this.state.notes}></textarea>
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
