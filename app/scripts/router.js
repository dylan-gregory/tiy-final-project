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
var AccountSettingsContainer = require('./components/accountSettings.jsx').AccountSettingsContainer;

var User = require('./models/user.js').User;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'login',
    'accountHome/:clientId': 'clientHome',
    'accountHome/:clientId/settings': 'clientSettings',
    // 'coachPortal/': 'coachPortal',
    'workspace/:coachId': 'coachWorkspace',
    'workspace/:coachId/settings': 'coachSettings',
    'workspace/:coachId/:clientId': 'viewClientDetails',
  },
  initialize: function(){
    // 
    // if (User.current()) {
    //   var user = User.current();
    //   parse.initialize({
    //     BASE_API_URL: 'https://metal-slug.herokuapp.com', sessionID: user.get('sessionToken')
    //   });
    //
    // }else {
    //   parse.initialize({
    //     BASE_API_URL: 'https://metal-slug.herokuapp.com'
    //   });
    // }
  // Do the parse setup to set headers and configure API url


  },
  execute: function(callback, args, name) {
  // var isLoggedIn = localStorage.getItem('user');
  var user = User.current();

  if (!user && name != 'login') {
    this.navigate('', {trigger: true});
    return false;
  }

  if(user){
    if (user.get('isCoach') && name == 'login'){
      this.navigate('workspace/' + user.get('objectId'), {trigger: true});
      return false;

    }else if(!user.get('isCoach') && name == 'login'){
      this.navigate('accountHome/' + user.get('objectId') , {trigger: true});
      return false;
    }
  }



  return Backbone.Router.prototype.execute.apply(this, arguments);
  },
  login: function(){
    ReactDOM.render(
      React.createElement(UserLoginContainer),
      document.getElementById('app')
    )
  },
  // coachPortal: function(){
  //   ReactDOM.render(
  //     React.createElement(CoachLoginContainer),
  //     document.getElementById('app')
  //   )
  // },
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
  viewClientDetails: function(coachId, clientId){
    ReactDOM.render(
      React.createElement(CoachViewClient, {coachId:coachId, id: clientId}),
      document.getElementById('app')
    )
  },
  clientSettings: function(id){
    ReactDOM.render(
      React.createElement(AccountSettingsContainer, {id: id}),
      document.getElementById('app')
    )
  },
  coachSettings: function(id){
    ReactDOM.render(
      React.createElement(AccountSettingsContainer, {id: id}),
      document.getElementById('app')
    )
  }
});

var myRouter = new AppRouter();

module.exports = myRouter;
