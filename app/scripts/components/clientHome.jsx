var React = require('react');
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;
var Todo = require('../models/models.js').Todo;
var TodoCollection = require('../models/models.js').TodoCollection;
var Detail = require('../models/models.js').Detail;
var DetailCollection = require('../models/models.js').DetailCollection;
var DailyValueCollection = require('../models/models.js').DailyValueCollection;

var NutritionixSearch = require('../models/nutritionixSearch.js').Nutritionix;


class ClientHomeContainer extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var clientTodos = new TodoCollection();
    var currentDetail = new Detail();
    var detailCollection = new DetailCollection();
    var dailyValueCollection = new DailyValueCollection();
    var dailyValues = new DailyValueCollection();



    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      this.setState({currentClient: currentClient, clientCollection});
    });

    clientTodos.fetch().then(() => {
      clientTodos = clientTodos.where({clientId: this.props.id});

      this.setState({
        clientTodos: clientTodos
      });
    });

    detailCollection.fetch().then(() => {
      currentDetail = detailCollection.findWhere({ownerId: this.props.id});

      var pic = currentDetail.get('pic');

      this.setState({
        currentDetail: currentDetail,
        detailCollection,
        pic
      });
    });

    dailyValueCollection.fetch().then(() => {
      dailyValues = dailyValueCollection.where({clientId: this.props.id});

        this.setState({
          dailyValues: dailyValues
        });

    });


    this.search = _.debounce(this.search, 300).bind(this);

    this.state = {
      currentClient,
      clientCollection,
      clientTodos,
      searchResults: [],
      detailCollection,
      currentDetail,
      dailyValues,
      dailyValueCollection
    };

  }
  componentWillReceiveProps(newProps){


  }
  checkOffTodo(todo){
    if (todo.get('isComplete')) {
      todo.set('isComplete', false);
    }else {
      todo.set('isComplete', true);
    }

    todo.save();
  }
  search(newSearch){
    var nutritionixSearch = new NutritionixSearch();

    var searchResults = nutritionixSearch.search(newSearch).then(data =>{
      this.setState({searchResults: data.hits});

    });

    console.log('state', this.state.searchResults);

  }
  addFood(food){


  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <h3> Welcome: { this.state.currentDetail ? this.state.currentDetail.get('name') :this.state.currentClient.get('username')}</h3>

            <MyTodoList
              clientTodos={this.state.clientTodos}
              checkOffTodo={this.checkOffTodo}
            />

          <div className="col m6">

              <h4>Daily Intake:</h4>
                <DailyIntakeList />

                <SearchBar search={this.search}
                  results={this.state.searchResults}
                  addFood={this.addFood}
                />

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
  // taskDone(todo){
  //   console.log('this todo', todo);
  //   $('#' + todo).prop('checked', true);
  //
  //   console.log("comp", todo);
  // }
  render(){

    var todoList = this.state.clientTodos.map(todo =>{
      return (

        <li key={todo.cid}>
          <input type="checkbox" defaultChecked={todo.get('isComplete') == true? "checked" : null}
            className="filled-in" id={todo.cid}
            onClick={() => {
              this.props.checkOffTodo(todo);
              }}

              />
          <label htmlFor={todo.cid}></label>
            <div className="collapsible-header">

              <span>{todo.get('title')}</span>
              <span className="right">Due: {todo.get('dueDate')}</span>

            </div>

          <div className="collapsible-body">
            {todo.get('notes')}
          </div>

        </li>
      )
    });


    return (

        <div className="col m6">
          <h4>Coming up:</h4>
            <form>
              <ul className="collapsible" data-collapsible="accordion">
                {todoList}
              </ul>
            </form>
        </div>

    )
  }
}

class SearchBar extends React.Component {
  constructor(props){
    super(props);

      // this.search = _.debounce(this.search).bind(this);
      this.handleSearchTerm = this.handleSearchTerm.bind(this);
      this.search = this.search.bind(this);
      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

    this.state = {
      results: [],
      searchTerm: ''
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({results: newProps.results});

  }
  search(e){
    // e.preventDefault();
    // e.persist();
    // var searchFor = e.target.value;
    // var nutritionixSearch = new NutritionixSearch();
    //
    // var searchResults = nutritionixSearch.search(searchFor).then(data =>{
    //   this.setState({results: data.hits});
    //
    // });
    //
    // console.log('state', this.state.results);
  }
  handleSearchTerm(e){

    if (e.target.value == '') {
      this.setState({searchTerm: ''});
    }else {
      this.setState({searchTerm: e.target.value});
    }
    this.props.search(this.state.searchTerm);

  }
  render(){

    var searchResults = this.state.results.map(result => {
      return (
        <li className="collection-item" key={result._id}>
          <span>{result.fields.item_name}{result.fields.nf_calories}</span>
          <span>{result.fields.nf_sugars}{result.fields.item_description}</span>

            <span className="right"><a className="btn-floating btn-small waves-effect waves-light red" onClick={(e) => {
                e.preventDefault();
                this.props.addFood(result);}}>
            <i className="material-icons">add</i>
            </a>
            </span>
            <div className="clearfix"></div>

        </li>
      )
    })

    return (
      <div className="search-wrapper card">
        <form>
          <input id="search" onChange={this.handleSearchTerm} />
          <i className="material-icons">search</i>
        </form>

        <ul className="collection">
          {searchResults}
        </ul>
      </div>
    )
  }
}


class DailyIntakeList extends React.Component {
  render(){



    return (
      <table className="striped">
        <thead>
          <tr>
            <th>Calories</th>
            <th>Sugar</th>
            <th>Sodium</th>
            <th>Carbs</th>
            <th>Cholesterol</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td>3,500</td>
            <td>30 (g)</td>
            <td>28 (g)</td>
            <td>25 (g)</td>
            <td>12 (g)</td>
            <td>
              <span className="right"><a className="btn-floating btn-small waves-effect waves-light red" onClick={(e) => {
                  e.preventDefault();
                  this.props.deleteTodo(todo);}}>
              <i className="material-icons">close</i>
              </a>
              </span>
            </td>
          </tr>



        </tbody>
      </table>
    )
  }
}


module.exports = {
  ClientHomeContainer
};
