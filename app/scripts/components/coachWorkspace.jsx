var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = window.$ = window.jQuery = require('jquery');
var Chart = require('chart.js');
var Polar = require('react-chartjs-2').Polar;



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

      console.log('my clients', clientCollection);

      // var clientIds = clientCollection.map(client => {
      //   client.get('objectId');
      //   return client.get('objectId');
      //
      // });
      //
      // clientNames = clientIds.map(id => {
      //   var client = detailCollection.findWhere({ownerId: id}).get('name');
      //   console.log('my names', client);
      //   // if (client) {
      //     return client;
      //   // }
      //   // if(client.get('name') == undefined){
      //   //   return 'New client';
      //   // }
      //
      //
      //
      // });
      //
      // clientStars = detailCollection.map(client => {
      //   console.log('stars', client.get('stars'));
      //   return client.get('stars');
      //
      // });
      // console.log('cl', clientStars);

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

                <h4>
                  <span className="chip valign-wrapper">
                    <img className="circle logged-in-avatar" src={this.state.pic !== undefined ? this.state.pic.url : "images/ic_account_circle_black_24px.svg"} />
                    <span>
                      {this.state.currentDetail !== undefined ? this.state.currentDetail.get('name') : this.state.currentCoach.get('username')}
                    </span>
                  </span>

                </h4>
            </header>

            <div className="row">
              <div className="col m7">
                <h4>
                  <div className="client-list-head">Client List</div>

                </h4>

                   <CoachClientList clientCollection={this.state.clientCollection}
                   currentCoach={this.state.currentCoach}
                   detailCollection={this.state.detailCollection}
                   clientTodos={this.state.clientTodos}
                  />

              </div>
              <div className="col s5">
                <h4>
                  <div className="starboard-head valign-wrapper"><a className="btn-floating btn-small waves-effect waves-light amber todo-delete">
                  <i className="material-icons">star</i>
                  </a>Starboard</div>

                </h4>

                  <div className="card starboard">
                    <div className="card-content">

                      <ClientStarChart
                        clientCollection={this.state.clientCollection}
                        detailCollection={this.state.detailCollection}
                      />

                    <hr className="stat-rule"/>

                      <ClientLeaderBoard
                        clientCollection={this.state.clientCollection}
                        detailCollection={this.state.detailCollection}

                      />



                    </div>

                  </div>





              </div>
            </div>
          </div>
      </BaseLayout>
    )
  }
}

// <span>Current number of clients: {this.state.clientCollection.length}</span>

// <div className="card-reveal">
//   <span className="card-title grey-text text-darken-4">Card Title<i className="material-icons right">close</i></span>
//
//     <ClientLeaderBoard
//       clientCollection={this.state.clientCollection}
//       detailCollection={this.state.detailCollection}
//
//     />
//
// </div>
// <div className="starboard-bottom card-title activator grey-text text-darken-4"><i className="material-icons right">more_vert</i></div>

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
    this.setState({clientCollection: newProps.clientCollection, currentCoach: newProps.currentCoach, detailCollection: newProps.detailCollection, clientTodos: newProps.clientTodos});

  }
  render(){

    console.log('todos' , this.state.clientTodos);

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
                <div className="determinate blue-grey" style={{width: 100 + '%'}}></div>
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

    this.state = {
      clientCollection: clientCollection,
      detailCollection: detailCollection,

    };

  }
  componentWillReceiveProps(newProps){

    this.setState({clientCollection: newProps.clientCollection, detailCollection: newProps.detailCollection});

  }
  render(){

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

class ClientStarChart extends React.Component {
  constructor(props){
    super(props);
    var clientCollection = new ClientCollection();
    var detailCollection = new DetailCollection();

    this.state = {
      clientCollection: clientCollection,
      detailCollection: detailCollection,

    };

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

  }
  componentWillReceiveProps(newProps){

    this.setState({clientCollection: newProps.clientCollection, detailCollection: newProps.detailCollection});

  }
  render(){

    var clientStars = this.state.clientCollection.map(client =>{
      return (

          this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('stars') : 0
      )
    });

    var clientNames = this.state.clientCollection.map(client => {
      return (
        this.state.detailCollection.findWhere({ownerId: client.get('objectId')}) !== undefined ? this.state.detailCollection.findWhere({ownerId: client.get('objectId')}).get('name') : client.get('username')
      )
    });

    var chartData = {
        labels: clientNames,
        datasets: [{
            data: clientStars,
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
    }
    return <Polar data={chartData} redraw />
  }
}

// style={{width: 200 + 'px', height: 250 + 'px'}}

module.exports = {
  CoachWorkspaceContainer
};
