var React = require('react');
var Backbone = require('backbone');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var Client = require('../models/models.js').Client;


class CoachViewClient extends React.Component {
  constructor(props){
    super(props);
    
  }
  render(){
    return (
      <BaseLayout>

      </BaseLayout>
    )
  }
}

module.exports = {
  CoachViewClient
};
