var React = require('react');
var Backbone = require('backbone');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

class ClientHomeContainer extends React.Component {
  constructor(props){
    super(props);

  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
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
