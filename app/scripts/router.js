var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var parse = require('./setup');
var BaseLayout = require('./components/layouts/base.jsx').BaseLayout;
var UserLoginContainer = require('./components/login.jsx').UserLoginContainer;
var CoachLoginContainer = require('./components/coachLogin.jsx').CoachLoginContainer;
var CoachWorkspaceContainer = require('./components/coachWorkspace.jsx').CoachWorkspaceContainer;
var ClientHomeContainer = require('./components/clientHome.jsx').ClientHomeContainer;
var CoachViewClient = require('./components/coachViewClient.jsx').CoachViewClient;

var User = require('./models/user.js').User;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'login',
    'accountHome/:clientId': 'clientHome',
    'coachPortal/': 'coachPortal',
    'workspace/:coachId': 'coachWorkspace',
    'workspace/:coachId/:clientId': 'viewClientDetails'
  },
  initialize: function(){

    if (User.current()) {
      var user = User.current();
      parse.setup({
        BASE_API_URL: 'https://metal-slug.herokuapp.com', sessionID: user.get('sessionToken')
      });

    }else {
      parse.setup({
        BASE_API_URL: 'https://metal-slug.herokuapp.com'
      });
    }
  // Do the parse setup to set headers and configure API url


  },
  execute: function(callback, args, name) {
  // var isLoggedIn = localStorage.getItem('user');
  var user = User.current();

  if (!user && name != 'login') {
    this.navigate('', {trigger: true});

  }

  if(user && name == 'login'){
    this.navigate('', {trigger: true});

  }

  if (user.get('isCoach') && name == 'login'){
    this.navigate('workspace/' + user.get('objectId'), {trigger: true});
    return false;

  }else if(!user.get('isCoach') && name == 'login'){
    this.navigate('accountHome/' + user.get('objectId') , {trigger: true});
    return false;
  }



  return Backbone.Router.prototype.execute.apply(this, arguments);
  },
  login: function(){
    ReactDOM.render(
      React.createElement(UserLoginContainer),
      document.getElementById('app')
    )
  },
  coachPortal: function(){
    ReactDOM.render(
      React.createElement(CoachLoginContainer),
      document.getElementById('app')
    )
  },
  coachWorkspace: function(coachId){

    ReactDOM.render(
      React.createElement(CoachWorkspaceContainer, {id: coachId}),
      document.getElementById('app')
    )
  },
  clientHome: function(clientId){
    ReactDOM.render(
      React.createElement(ClientHomeContainer, {id: clientId}),
      document.getElementById('app')
    )
  },
  viewClientDetails: function(clientId){

    // no client specific form created yet, but will need to pass it this prop
    ReactDOM.render(
      React.createElement(CoachViewClient, {id: clientId}),
      document.getElementById('app')
    )
  }
});

var myRouter = new AppRouter();

module.exports = myRouter;
