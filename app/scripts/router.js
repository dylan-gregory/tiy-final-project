var Backbone = require('backbone');
var React = require('react');
var ReactDOM = require('react-dom');


var BaseLayout = require('./components/layouts/base.jsx').BaseLayout;

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'login'
  },
  login: function(){
    ReactDOM.render(
      React.createElement(BaseLayout),
      document.getElementById('app')
    )
  }
});

var myRouter = new AppRouter();

module.exports = myRouter;
