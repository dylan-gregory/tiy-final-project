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
var DailyValue = require('../models/models.js').DailyValue
var DailyValueCollection = require('../models/models.js').DailyValueCollection;

var NutritionixSearch = require('../models/nutritionixSearch.js').Nutritionix;


require('materialize-sass-origin/js/bin/materialize.js');
require('materialize-sass-origin/js/tooltip.js');
require('materialize-sass-origin/js/sideNav.js');
require('materialize-sass-origin/js/slider.js');


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

      if(currentDetail !== undefined){
        var pic = currentDetail.get('pic');
        this.setState({pic: pic.url});
        console.log('pic', pic);
      }

      this.setState({
        currentDetail: currentDetail,
        detailCollection
      });
    });

    dailyValueCollection.fetch().then(() => {
      dailyValues = dailyValueCollection.where({clientId: this.props.id});

        this.setState({
          dailyValues: dailyValues
        });

    });

    this.search = _.debounce(this.search, 800).bind(this);
    this.addFood = this.addFood.bind(this);
    this.resetIntake = this.resetIntake.bind(this);

    this.state = {
      clientId: this.props.id,
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
  componentDidMount(){
    $('.button-collapse').sideNav('show');
    $('.tooltipped').tooltip({delay: 50});
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

    this.state.dailyValueCollection.create(food, {success: () =>

      this.state.dailyValueCollection.fetch().then(() => {
        var updatedValues = this.state.dailyValueCollection.where({clientId: this.props.id});

          this.setState({
            dailyValues: updatedValues
          });

      })

    });

  }
  resetIntake(intake){

    intake.map(model => {
        model.destroy({success: ()=>{

          this.state.dailyValueCollection.fetch().then(() => {
            var updatedValues = this.state.dailyValueCollection.where({clientId: this.props.id});
            console.log('vals', updatedValues);

              this.setState({
                dailyValues: updatedValues
              });

          });

        }});
      });

  }
  cashStars(){
    this.state.currentDetail.set('stars', 0);

    this.state.currentDetail.save({success: () => {

      this.state.detailCollection.fetch().then(() => {
        var currentDetail = this.state.detailCollection.findWhere({ownerId: this.props.id});

        this.setState({
          currentDetail: currentDetail
        });
      });
    }});
  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <div>
              <div className="logged-in-as">Logged in as:</div>
              <div className="home-header">
                <span className="col m9 valign-wrapper">
                  <img className="circle logged-in-avatar" src={this.state.currentDetail !== undefined ? this.state.pic : "images/ic_account_circle_black_24px.svg"} />

                  {this.state.currentDetail ? this.state.currentDetail.get('name') : this.state.currentClient.get('username')}
                </span>

                <span className="col m3 your-stars valign-wrapper">
                  Your stars: {this.state.currentDetail ? this.state.currentDetail.get('stars') : 0}
                  <a className="btn-floating btn-small waves-effect waves-light amber tooltipped" data-position="bottom" data-delay="50" data-tooltip="Cash in your stars!"
                    onClick={(e) => {
                        e.preventDefault();
                    this.cashStars();}}>
                    <i className="material-icons star">star</i>
                    </a>
                  </span>

              </div>

            </div>

            <MyTodoList
              clientTodos={this.state.clientTodos}
              checkOffTodo={this.checkOffTodo}
            />

          <div className="col m5">


                <DailyIntakeList
                  dailyValues={this.state.dailyValues}
                  resetIntake={this.resetIntake}
                />

                <SearchBar
                  search={this.search}
                  results={this.state.searchResults}
                  addFood={this.addFood}
                  clientId={this.state.clientId}
                />




            </div>
          </div>
        </div>

      </BaseLayout>
    )
  }
}

// <ul id="slide-out" className="side-nav"></ul>
// <div className="fixed-action-btn horizontal click-to-toggle">
//   <a className="btn-floating btn-small waves-effect waves-light amber"><i className="material-icons star">star</i></a>
//   <ul>
//     <li><a className="btn-floating green"><i className="material-icons">publish</i></a></li>
//   </ul>
// </div>
// <ul id="slide-out" className="side-nav">
//   <DailyIntakeList
//     dailyValues={this.state.dailyValues}
//     resetIntake={this.resetIntake}
//   />
//
//   <SearchBar
//     search={this.search}
//     results={this.state.searchResults}
//     addFood={this.addFood}
//     clientId={this.state.clientId}
//   />
// <a href="#" data-activates="slide-out" className="button-collapse"><i className="material-icons">menu</i></a>
// </ul>


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
  render(){

    var todoList = this.state.clientTodos.map(todo =>{
      return (

        <li key={todo.cid}>

            <div className="collapsible-header">
              <span>
                <input type="checkbox" defaultChecked={todo.get('isComplete') == true? "checked" : null}
                  className="filled-in checkbox" id={todo.cid}
                  onClick={() => {
                    this.props.checkOffTodo(todo);
                    }}

                    />
                  <label htmlFor={todo.cid} className="check-label"></label>
                </span>

              <span>{todo.get('title')}</span>
              <span className="right">Due: {todo.get('dueDate')}</span>

            </div>

          <div className="collapsible-body">
            <div className="client-notes">
              Notes: {todo.get('notes')}
            </div>


          </div>

        </li>
      )
    });


    return (

        <div className="col m7">
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
      this.addFood = this.addFood.bind(this);

      var clientId = this.props.clientId;

    this.state = {
      results: [],
      searchTerm: '',
      clientId: '',
      owner: {"__type": "Pointer", "className": "_User", "objectId": clientId},
      name: '',
      calories: 0,
      sugar: 0,
      carbs: 0,
      sodium: 0,
      cholesterol: 0
    };

  }
  componentWillReceiveProps(newProps){
    this.setState({results: newProps.results, clientId: newProps.clientId});

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
  addFood(food){

    this.setState({
      name: food.fields.item_name,
      calories: food.fields.nf_calories,
      sugar: food.fields.nf_sugars,
      carbs: food.fields.nf_total_carbohydrate,
      sodium: food.fields.nf_sodium,
      cholesterol: food.fields.nf_cholesterol
    }, () => {


      this.props.addFood(this.state);
    });

    // //  this.props.addFood(this.state);

  }
  render(){

    var searchResults = this.state.results.map(result => {
      return (
        <li className="collection-item" key={result._id}>
          <div>{result.fields.item_name} - {result.fields.item_description}</div>

            <div>Serving Size: {result.fields.nf_serving_size_qty} {result.fields.nf_serving_size_unit}
            </div>

          <div>Cal: {result.fields.nf_calories} Sugars: {result.fields.nf_sugars}</div>
          <div>
             Sodium: {result.fields.nf_sodium} Cholest: {result.fields.nf_cholesterol} Carbs: {result.fields.nf_total_carbohydrate}</div>

            <span className="right"><a className="btn-floating btn-small waves-effect waves-light red" onClick={(e) => {
                e.preventDefault();
                this.addFood(result);}}>
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
          <input id="search" onChange={this.handleSearchTerm} value={this.state.searchTerm} />
          <i className="material-icons">search</i>
        </form>

        <ul className="collection">
          {this.state.searchTerm !== '' ? searchResults : null}
        </ul>
      </div>
    )
  }
}


class DailyIntakeList extends React.Component {
  constructor(props){
    super(props);

    var dailyValues = new DailyValueCollection();

    this.state = {
      dailyValues
    }

  }
  componentWillReceiveProps(newProps){
    this.setState({dailyValues: newProps.dailyValues});

  }
  render(){

    var calArray = this.state.dailyValues.map(food => {
      return food.get('calories');
    });

    var totalCal = _.reduce(calArray, function(memo, num){
      return memo + num;
    });

    var sugarArray = this.state.dailyValues.map(food => {
      return food.get('sugar');
    });

    var totalSugar = _.reduce(sugarArray, function(memo, num){
      return memo + num;
    });

    var sodiumArray = this.state.dailyValues.map(food => {
      return food.get('sodium');
    });

    var totalSodium = _.reduce(sodiumArray, function(memo, num){
      return memo + num;
    });

    var carbsArray = this.state.dailyValues.map(food => {
      return food.get('carbs');
    });

    var totalCarbs = _.reduce(carbsArray, function(memo, num){
      return memo + num;
    });

    var cholestArray = this.state.dailyValues.map(food => {
      return food.get('cholesterol');
    });

    var totalCholest = _.reduce(cholestArray, function(memo, num){
      return memo + num;
    });

    return (

        <div>
          <h4>Daily Intake:
            <span className="refresh-button"><a className="btn-floating btn-small waves-effect waves-light tooltipped intake-refresh" data-position="bottom" data-delay="50" data-tooltip="Restart counter" onClick={(e) => {
                e.preventDefault();
                this.props.resetIntake(this.state.dailyValues);}}>
            <i className="material-icons">refresh</i>
            </a>
            </span>
          </h4>

          <table className="striped responsive-table">
            <thead>
              <tr className="counter-head">
                <th>Calories</th>
                <th>Sugar</th>
                <th>Sodium</th>
                <th>Carbs</th>
                <th>Cholesterol</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td>{totalCal ? parseFloat(totalCal).toFixed(2) : 0}</td>
                <td>{totalSugar ? parseFloat(totalSugar).toFixed(1) : 0}(g)</td>
                <td>{totalSodium ? parseFloat(totalSodium).toFixed(1) : 0}(g)</td>
                <td>{totalSodium ? parseFloat(totalSodium).toFixed(1) : 0}(g)</td>
                <td>{totalCholest ? parseFloat(totalCholest).toFixed(1) : 0}(g)</td>

              </tr>



            </tbody>
          </table>
        </div>
    )
  }
}


module.exports = {
  ClientHomeContainer
};
