var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

var User = require('../models/user.js').User;
var Coach = require('../models/models.js').Coach;
var CoachCollection = require('../models/models.js').CoachCollection;
var ClientCollection = require('../models/models.js').ClientCollection;
var Detail = require('../models/models.js').Detail;
var DetailCollection = require('../models/models.js').DetailCollection;

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
        this.setState({pic});
      }


      console.log('deet', currentDetail);

      this.setState({
        currentDetail: currentDetail,
        detailCollection

      });


    });



    // var userId = User.current().get('objectId');
    //
    // clientCollection.parseWhere(
    // 'coachId', '_User', userId
    // ).fetch().then(()=> {
    //   //
    //   // clientCollection = coachCollection.findWhere({coachId: this.props.id});
    //
    //   console.log('clients', clientCollection);
    //   this.setState({clientCollection: clientCollection});
    // });


    this.state = {
      currentCoach,
      coachCollection,
      clientCollection,
      detailCollection,
      currentDetail
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
            <header>{ this.state.currentDetail !== undefined ? this.state.currentDetail.get('name') :this.state.currentCoach.get('username')}/Icon</header>
            <div className="row">
              <div className="col m8">
                <h2>Client List</h2>

                   <CoachClientList clientCollection={this.state.clientCollection}
                   currentCoach={this.state.currentCoach}
                  />

              </div>
              <div className="col s4">
                <h2>Client Leaderboard</h2>

                  <ClientLeaderBoard clientCollection={this.state.clientCollection}
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

    this.state = {
      clientCollection: this.props.clientCollection,
      currentCoach: this.props.currentCoach
    }
  }
  componentWillReceiveProps(newProps){
    this.setState({clientCollection: newProps.clientCollection, currentCoach: newProps.currentCoach});

  }
  render(){
    var clientList = this.state.clientCollection.map(client =>{
      return (

          <li className="collection-item avatar" key={client.cid}>
            <div >
              <img src="" alt="" className="circle red" />
              <a href={'#workspace/' + this.state.currentCoach.get('objectId') +'/' + client.get('objectId')}>{client.get('username')}</a>

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

class ClientLeaderBoard extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();

    this.state = {
      clientCollection: this.props.clientCollection
    }
  }
  componentWillReceiveProps(newProps){
    this.setState({clientCollection: newProps.clientCollection});

  }
  render(){

    var clientPoints = this.state.clientCollection.map(client =>{
      return (

        <tr key={client.cid}>
          <td>{client.get('username')}</td>
          <td>1,567</td>
        </tr>

      )
    });

    return (
      <table className="striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score/Points</th>
          </tr>
        </thead>
        <tbody>

          {clientPoints}

        </tbody>
      </table>
    )
  }
}

module.exports = {
  CoachWorkspaceContainer
};
