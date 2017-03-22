var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = window.$ = window.jQuery = require('jquery');
var Chart = require('chart.js');

var User = require('../models/user.js').User;
var Coach = require('../models/models.js').Coach;
var CoachCollection = require('../models/models.js').CoachCollection;
var ClientCollection = require('../models/models.js').ClientCollection;
var Detail = require('../models/models.js').Detail;
var DetailCollection = require('../models/models.js').DetailCollection;
var Todo = require('../models/models.js').Todo;
var TodoCollection = require('../models/models.js').TodoCollection;


// These are the specific Materialize things needed to work the collapsibles


require('materialize-sass-origin/js/collapsible.js');
require('materialize-sass-origin/js/jquery.easing.1.3.js');



var BaseLayout = require('./layouts/base.jsx').BaseLayout;

class CoachWorkspaceContainer extends React.Component{
  constructor(props){
    super(props);

    var coachCollection = new CoachCollection();
    var currentCoach = new Coach();
    var clientCollection = new ClientCollection();
    var currentDetail = new Detail();
    var detailCollection = new DetailCollection();
    var clientTodos = new TodoCollection();
    var clientNames;
    var clientStars;

    coachCollection.fetch().then(() => {
      currentCoach = coachCollection.findWhere({objectId: this.props.id});

      clientCollection = coachCollection.where({coachId: this.props.id});

      this.setState({
        currentCoach: currentCoach,
        coachCollection: coachCollection,
        clientCollection: clientCollection
      });

    });

    detailCollection.fetch().then(() => {
      currentDetail = detailCollection.findWhere({ownerId: this.props.id});
      console.log('here', currentDetail);

      if (currentDetail !== undefined) {
        var pic = currentDetail.get('pic');
        this.setState({pic: pic});
      }

      clientNames = detailCollection.map(client => {
        console.log('name', client.get('name'));
       return client.get('name');

      });

      clientStars = detailCollection.map(client => {
        console.log('stars', client.get('stars'));
        return client.get('stars');

      });
      console.log('cl', clientStars);

      this.setState({
        currentDetail: currentDetail,
        detailCollection: detailCollection,
        clientStars: clientStars,
        clientNames: clientNames

      });

    });



    clientTodos.fetch().then(() => {
      clientTodos = clientTodos.where({clientId: this.props.id});

        this.setState({
          clientTodos: clientTodos
        });

    });


    this.state = {
      currentCoach,
      coachCollection,
      clientCollection,
      detailCollection,
      currentDetail,
      clientNames,
      clientStars,
      clientTodos
    };

  }
  componentDidMount(){

    $('.collapsible').collapsible();

  }
  componentWillReceiveProps(newProps){
    this.setState({clientCollection: newProps.clientCollection});
    //
    // this.setState({currentCoach: newProps.currentCoach});
  }
  render(){
    return (

      <BaseLayout>

          <div className="container">
            <header>

              <ul className="collection">
                <li className="collection-item avatar">
                  <img className="circle grey" src={this.state.pic !== undefined ? this.state.pic.url : null} />
                  <h4>{this.state.currentDetail !== undefined ? this.state.currentDetail.get('name') : this.state.currentCoach.get('username')}
                  </h4>
                  <span>Current number of clients: {this.state.clientCollection.length}</span>
                </li>
              </ul>

            </header>

            <div className="row">
              <div className="col m8">
                <h2>Client List</h2>

                   <CoachClientList clientCollection={this.state.clientCollection}
                   currentCoach={this.state.currentCoach}
                   detailCollection={this.state.detailCollection}
                  />

              </div>
              <div className="col s4">
                <h2>Leaderboard</h2>

                  <ClientLeaderBoard
                    clientCollection={this.state.clientCollection}
                    detailCollection={this.state.detailCollection}
                    clientStars={this.state.clientStars}
                    clientNames={this.state.clientNames}
                  />

              </div>
            </div>
          </div>
      </BaseLayout>
    )
  }
}

class CoachClientList extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var detailCollection = new DetailCollection();


    detailCollection.fetch().then(() => {
      this.setState({
        detailCollection: detailCollection
      });
    });

    this.state = {
      clientCollection: this.props.clientCollection,
      currentCoach: this.props.currentCoach,
      detailCollection
    };
  }
  componentWillReceiveProps(newProps){
    this.setState({clientCollection: newProps.clientCollection, currentCoach: newProps.currentCoach, detailCollection: newProps.detailCollection});

  }
  render(){

    var clientList = this.state.clientCollection.map(client =>{
      return (

          <li className="collection-item avatar" key={client.cid}>
            <div>

              <img src={this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('pic').url : "images/ic_account_circle_black_24px.svg" } className="circle" />

              <a className="client-name"
                href={'#workspace/' + this.state.currentCoach.get('objectId') + '/' + client.get('objectId')}>
                {this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('name') : client.get('username')}
              </a>

              <div className="progress">
                <div className="determinate" style={{width: 70 + '%'}}></div>
              </div>

            </div>
          </li>

      )
    });

    return (
        <ul className="collection">
          {clientList}
        </ul>

    )
  }
}

// {this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('pic').url}
//this.state.detailCollection ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('name') :

class ClientLeaderBoard extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var detailCollection = new DetailCollection();

    var clientNames;
    var clientStars;


    this.state = {
      clientCollection: clientCollection,
      detailCollection: detailCollection,
      clientStars: this.props.clientStars,
      clientNames: this.props.clientNames

    };

  }
  componentWillReceiveProps(newProps){

    this.setState({clientCollection: newProps.clientCollection, detailCollection: newProps.detailCollection, clientStars: newProps.clientStars, clientNames: newProps.clientNames});

  }
  componentDidMount(){

    console.log('state', this.state);
    // var this.state.detailCollection.findWhere({ownerId: client.get('objectId')})

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: this.state.clientNames,
            datasets: [{
                label: '# of Votes',
                data: this.state.clientStars,
                backgroundColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });


  }
  render(){

      console.log('names', this.state.clientNames);

    var clientPoints = this.state.clientCollection.map(client =>{
      return (

        <tr key={client.cid}>
          <td>{this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('name') : client.get('username')}</td>
          <td>{this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('stars') : 0 }</td>
        </tr>

      )
    });

    return (
      <div>
        <canvas id="myChart" style={{width: 200 + 'px', height:200 + "px"}}></canvas>

          <table className="striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Stars</th>
              </tr>
            </thead>
            <tbody>

              {clientPoints}

            </tbody>
          </table>

      </div>
    )
  }
}

module.exports = {
  CoachWorkspaceContainer
};
