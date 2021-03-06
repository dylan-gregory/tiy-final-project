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
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

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
  componentWillReceiveProps(newProps){
    this.setState({currentDetail: newProps.currentDetail});
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


              this.setState({
                dailyValues: updatedValues
              });



          });

        }});
      });

  }
  cashStars(){

    console.log('detail', this.state.currentDetail);
    var newStars = this.state.currentDetail;
    newStars.set('stars', 0);
    newStars.save();

    this.forceUpdate();

    // this.state.currentDetail.save({success: () => {
    //
    //
    //
    //   this.state.detailCollection.fetch().then(() => {
    //     var newDetail = this.state.detailCollection.findWhere({ownerId: this.props.id});
    //
    //
    //
    //     this.setState({
    //       currentDetail: newDetail,
    //       detailCollection
    //     });
    //
    //
    //   });
    // }});
  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <div className=" col m12">

            </div>

            <MyTodoList
              clientTodos={this.state.clientTodos}
              checkOffTodo={this.checkOffTodo}
            />

          <div className="col l5 m6 s12">


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

              <div className="card star-card">


                  <div className="your-stars">
                    <div className="valign-wrapper">
                      Your stars: {this.state.currentDetail ? this.state.currentDetail.get('stars') : 0}
                      <a className="btn-floating btn-small waves-effect waves-light amber tooltipped star-btn" data-position="bottom" data-delay="50" data-tooltip="Cash in your stars!"
                        onClick={() => {

                        this.cashStars();}}>
                        <i className="material-icons star">star</i>
                        </a>
                      </div>


                  </div>

                  <div className="card-content ">
                    <span className="card-title activator grey-text text-darken-4">Star Rewards<i className="material-icons right">more_vert</i></span>

                  </div>
                  <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">Rewards:<i className="material-icons right">close</i></span>

                      <table className="striped">
                        <thead>
                          <tr>
                            <th># of Stars</th>
                            <th>Reward</th>
                          </tr>
                        </thead>
                        <tbody>

                          <tr>
                            <td>10</td>
                            <td>1 Cheat Meal</td>
                          </tr>
                          <tr>
                            <td>25</td>
                            <td>Cheat Day</td>
                          </tr>
                          <tr>
                            <td>40</td>
                            <td>Cheat Weekend</td>
                          </tr>

                        </tbody>
                      </table>


                  </div>
                </div>




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


            </div>

          <div className="collapsible-body">
            <div>Due: {todo.get('dueDate')}</div>
            <div className="client-notes">
              <i className="material-icons">comment</i> {todo.get('notes')}

            </div>


          </div>

        </li>
      )
    });


    return (

        <div className="col l7 m6 s12">
          <h4>
            <span className="client-list-head valign-wrapper">Coming up</span>
            </h4>
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
      cholesterol: food.fields.nf_cholesterol,
      searchTerm: ''
    }, () => {


      this.props.addFood(this.state);
    });

    // //  this.props.addFood(this.state);

  }
  render(){

    var searchResults = this.state.results.map(result => {
      return (
        <li className="collection-item" key={result._id}>
          <div className="food-header">{result.fields.item_name} - {result.fields.item_description}</div>

          <hr />

            <div><span>Serving Size:</span> {result.fields.nf_serving_size_qty} {result.fields.nf_serving_size_unit}
            </div>

          <div><span>Cal:</span> {result.fields.nf_calories} <span>Sugars:</span> {result.fields.nf_sugars}</div>
          <div>
             <span>Sodium:</span> {result.fields.nf_sodium} <span>Cholest:</span> {result.fields.nf_cholesterol} <span>Carbs:</span> {result.fields.nf_total_carbohydrate}</div>

            <span className="right"><a className="btn-floating btn-small waves-effect waves-light red valign-wrapper" onClick={(e) => {
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
          <input id="search" onChange={this.handleSearchTerm} value={this.state.searchTerm} placeholder="  Search for lasagna, broccoli, Taco Bell..."/>
          <i className="material-icons search-i">search</i>
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

          <h4>
            <div className="intake-head valign-wrapper">
              <a className="btn-floating btn-small waves-effect waves-light tooltipped intake-refresh" data-position="bottom" data-delay="50" data-tooltip="Restart counter" onClick={(e) => {
                e.preventDefault();
                this.props.resetIntake(this.state.dailyValues);}}>
            <i className="material-icons">refresh</i>
            </a>
            Daily Intake
          </div>

          </h4>



          <table className="striped">
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

// <h4>
//   <span className="client-list-head valign-wrapper">
//     <span className="refresh-button"><a className="btn-floating btn-small waves-effect waves-light tooltipped intake-refresh" data-position="bottom" data-delay="50" data-tooltip="Restart counter" onClick={(e) => {
//         e.preventDefault();
//         this.props.resetIntake(this.state.dailyValues);}}>
//     <i className="material-icons">refresh</i>
//     </a>
//     </span>
//     Daily Intake
//   </span>
// </h4>


module.exports = {
  ClientHomeContainer
};
