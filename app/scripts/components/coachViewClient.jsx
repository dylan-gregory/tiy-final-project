var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;
var Todo = require('../models/models.js').Todo;
var TodoCollection = require('../models/models.js').TodoCollection;
var Detail = require('../models/models.js').Detail;
var DetailCollection = require('../models/models.js').DetailCollection;

require('materialize-sass-origin/js/collapsible.js');
require('materialize-sass-origin/js/jquery.easing.1.3.js');

require('materialize-sass-origin/js/date_picker/picker.date.js');
require('materialize-sass-origin/js/date_picker/picker.js');


class CoachViewClient extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var clientTodos = new TodoCollection();
    var currentTodos = new TodoCollection();
    var currentDetail = new Detail();
    var detailCollection = new DetailCollection();

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

        this.setState({
          currentTodos: clientTodos
        });

    });

    detailCollection.fetch().then(() => {
      currentDetail = detailCollection.findWhere({ownerId: this.props.id});

      if (currentDetail !== undefined) {
        var pic = currentDetail.get('pic').url;
        this.setState({pic: pic});
      }

      this.setState({
        currentDetail: currentDetail,
        detailCollection,
        clientPic: pic
      });
    });

    this.state = {
      currentClient,
      clientCollection,
      clientTodos,
      currentTodos,
      detailCollection,
      currentDetail,
      clientPic: null,
      clientId,
      currentDate: '',
      currentTitle: '',
      currentNotes: ''
    };

    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.awardStar = this.awardStar.bind(this);

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
  editTodo(todo){
    // this.setState({
    //   currentDate: todo.get('dueDate'),
    //   currentTitle: todo.get('title'),
    //   currentNotes: todo.get('notes')
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
  awardStar(){
    console.log('starred');

    console.log(this.state.currentClient.get('stars'));
    this.state.currentDetail.set({stars: this.state.currentDetail.get('stars') + 1});
    this.state.currentDetail.save();

  }
  toggleForm(){
    this.setState({showForm: !this.state.showForm});

  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <h2>Client:

            {console.log('pic', this.state.clientPic)}
            <img className="circle avatar-image" src={this.state.clientPic !== undefined ? this.state.clientPic : null} />
            {this.state.currentDetail ?  this.state.currentDetail.get('name') : this.state.currentClient.get('username')}</h2>

          <div className="row">

            <ClientTodoList currentClient={this.state.currentClient}
                            currentTodos={this.state.currentTodos}
                            deleteTodo={this.deleteTodo}
                            addTodo={this.addTodo}
                            clientId={this.state.clientId}
                            editTodo={this.editTodo}
                            awardStar={this.awardStar}
            />

          </div>

            <div className="row">

            </div>

        </div>

      </BaseLayout>
    )
  }
}

// { this.state.showForm ? <TodoForm currentTodos={this.state.currentTodos}
//             addTodo={this.addTodo}
//             clientId={this.state.clientId}
// />
// : null}



class ClientTodoList extends React.Component {
  constructor(props){
    super(props);

    var currentTodos = this.props.currentTodos;

    console.log('todos in list', this.props.currentTodos);

    this.toggleForm = this.toggleForm.bind(this);
    this.editTodo = this.editTodo.bind(this);

    this.state = {
      currentClient: this.props.currentClient,
      currentTodos: currentTodos,
      currentDate: '',
      currentTitle: '',
      currentNotes: '',
      showForm: false
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({currentTodos: newProps.currentTodos});

  }
  componentDidMount(){

    $('.collapsible').collapsible();

  }
  editTodo(todo){
    this.setState({
      currentDate: todo.get('dueDate'),
      currentTitle: todo.get('title'),
      currentNotes: todo.get('notes')
    });
    // this.props.editTodo(todo);
  }
  toggleForm(){
    this.setState({showForm: !this.state.showForm});

  }
  render(){
    var todoList = this.state.currentTodos.map(todo =>{
      return (

        <li key={todo.cid}>
          <div className="collapsible-header"><input type="checkbox"/>

            <span>{todo.get('title')}</span>
            <span className="right">Due: {todo.get('dueDate')}</span>

            {todo.get('isComplete') ? <span>
              <i className="material-icons">check_circle</i>
            </span>
            : null }

          </div>
          <div className="collapsible-body">
            <div className="todo-notes">Notes: {todo.get('notes')}</div>

            <span className="right"><a className="btn-floating btn-small waves-effect waves-light red todo-delete" onClick={(e) => {
                e.preventDefault();
            this.props.deleteTodo(todo);}}>
            <i className="material-icons">close</i>
            </a>
            </span>

            {todo.get('isComplete') ?
                <span className="right"><a className="btn-floating btn-small waves-effect waves-light amber todo-delete" onClick={(e) => {
                    e.preventDefault();
                this.props.awardStar(todo);}}>
                <i className="material-icons">star</i>
                </a>
                </span>
                : null }

            <div className="clearfix"></div>


          </div>
        </li>
      )
    });


    return (


        <div className="col m8">
          <h3>Coming up:</h3>
            <ul className="collapsible" data-collapsible="accordion">
              {todoList}

              <li>
                <div className="collapsible-header">

                  <span className="right">Add new task </span><a onClick={this.toggleForm} className="btn-floating btn-small waves-effect waves-light right todo-add-button center-align middle-valign"><i className="material-icons add-icon">add</i></a>

                  <div className="clearfix"></div>

                </div>

                <div className="collapsible-body">

                  <TodoForm currentTodos={this.props.currentTodos}
                          addTodo={this.props.addTodo}
                          clientId={this.props.clientId}
                          currentDate={this.state.currentDate}
                          currentTitle={this.state.currentTitle}
                          currentNotes={this.state.currentNotes}
                  />
                </div>

              </li>
            </ul>
        </div>

    )
  }
}



    // <span className="right"><a className="btn-floating btn-small waves-effect waves-light yellow" onClick={(e) => {
    //     e.preventDefault();
    //     this.toggleForm();
    //     this.editTodo(todo);}}>
    // <i className="material-icons">build</i>
    // </a>
    // </span>



class TodoForm extends React.Component {
  constructor(props){
    super(props);

    this.handleTitle = this.handleTitle.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    var clientId = this.props.clientId;


    this.state = {
      title: this.props.currentTitle,
      dueDate: this.props.currentDate,
      notes: this.props.currentNotes,
      clientId: '',
      owner: {"__type": "Pointer", "className": "_User", "objectId": clientId},

    }
  }
  componentDidMount(){
    $('.datepicker').pickadate({
      formatSubmit: 'd/mmm/yyyy',
      hiddenName: true
      // selectMonths: true, // Creates a dropdown to control month
      // selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    // This was the simplest thing in the world that took WAY too long to figure out
    $('.datepicker').change(() => {
      this.setState({dueDate: $('.datepicker').val()});
    });

  }
  componentWillReceiveProps(newProps){
    this.setState({clientId: newProps.clientId});

  }
  handleTitle(e){
    this.setState({title: e.target.value});
  }
  handleDate(e){

    console.log('date', this.state.dueDate);

    // this.setState({dueDate: });
  }
  handleNotes(e){
    this.setState({notes: e.target.value});
  }
  addTodo(e){
    e.preventDefault();
    this.props.addTodo(this.state);
    this.setState({title: '', dueDate: '', notes: ''});
  }
  render(){
    return (

        <div>
          <form onSubmit={this.addTodo}>
            <div>
              <input type="text" onChange={this.handleTitle} placeholder="What should I do?" value={this.state.title}/>

              <input name="date-input" type="date" onChange={this.handleDate} value={this.state.dueDate} className="datepicker" placeholder="When is this due by?"/>

                <div>
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

    )
  }
}


module.exports = {
  CoachViewClient
};
