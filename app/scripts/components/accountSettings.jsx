var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;

class AccountSettingsContainer extends React.Component {
  constructor(props){
    super(props);
  }
  render(){

    return (

      <BaseLayout>
        <div className="container">
          <div className="col m12">
            <div className="row">
              <h2>Account Info</h2>
            </div>
          </div>
        </div>

      </BaseLayout>
    )
  }
}

module.exports = {
  AccountSettingsContainer
};
