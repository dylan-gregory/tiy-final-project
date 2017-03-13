var React = require('react');
var Backbone = require('backbone');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;


class ClientHomeContainer extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var currentClient = new Client();



    clientCollection.fetch().then(() => {
      currentClient = clientCollection.findWhere({objectId: this.props.id});

      this.setState({currentClient: currentClient, coachCollection});
      console.log(coachCollection);
      console.log(currentCoach);
    });

    console.log(localStorage.getItem('user'));

    this.state = {
      currentCoach,
      coachCollection
    };

  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <h2> Welcome: </h2>
            <div className="col m8">
              <h2>Your Weekly Tasks</h2>
              <ul>
                <li>Walk 2 miles</li>
                <li>Eat a new vegetable</li>
                <li>Do 30 minutes of yoga each morning</li>
              </ul>
            </div>
            <div className="col m4">
              <h3>Calorie counter/Nutritionix search will go here</h3>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }
}

module.exports = {
  ClientHomeContainer
};
