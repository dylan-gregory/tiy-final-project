var React = require('react');
var Backbone = require('backbone');
var $ = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;
var Todo = require('../models/models.js').Todo;
var TodoCollection = require('../models/models.js').TodoCollection;


class ClientHomeContainer extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var clientTodos = new TodoCollection();


    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      this.setState({currentClient: currentClient, clientCollection});
      console.log(clientCollection);
      console.log(currentClient);
    });

    clientTodos.fetch().then(() => {
      clientTodos = clientTodos.where({clientId: this.props.id});

      this.setState({
        clientTodos: clientTodos
      });
      console.log('current', clientTodos);
    });


    this.state = {
      currentClient,
      clientCollection,
      clientTodos
    };

  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <h3> Welcome: {this.state.currentClient.get('username')}</h3>

            <MyTodoList clientTodos={this.state.clientTodos}/>

            <div className="col m4">
              <h3>Calorie counter/Nutritionix search will go here</h3>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }
}


class MyTodoList extends React.Component {
  constructor(props){
    super(props);

    var clientTodos = this.props.clientTodos;

    console.log('todos in list', this.props.clientTodos);

    this.state = {
      currentClient: this.props.currentClient,
      clientTodos: clientTodos
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({clientTodos: newProps.clientTodos});

  }
  componentDidMount(){

    $('.collapsible').collapsible();

  }
  taskDone(todo){
    console.log('this todo', todo);
    $(todo).prop('checked', true);
  }
  render(){
    var todoList = this.state.clientTodos.map(todo =>{
      return (

        <li key={todo.cid} id={todo.cid}>

          <input type="checkbox" className={todo.cid} id="filled-in-box" onClick={(e) => {e.preventDefault();
                     this.taskDone(todo.cid);}}/>
          <label htmlFor="filled-in-box"></label>
            <div className="collapsible-header">{todo.get('title')}{todo.get('dueDate')}</div>

          <div className="collapsible-body">
            {todo.get('notes')}
          </div>

        </li>
      )
    });


    return (


        <div className="col m8">
          <h3>Todos</h3>
            <form>
              <ul className="collapsible" data-collapsible="accordion">
                {todoList}
              </ul>
            </form>
        </div>

    )
  }
}


module.exports = {
  ClientHomeContainer
};
