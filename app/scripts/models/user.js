var $ = require('jquery');
var Backbone = require('backbone');

var parse = require('../setup.js').parse;

var ParseModel = require('./models.js').ParseModel;


var User = ParseModel.extend({
  idAttribute: 'objectId',
  urlRoot: 'https://metal-slug.herokuapp.com/users',
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    return Backbone.Model.prototype.save.apply(this, arguments);
  }
}, {
  login: function(credentials, callback){
    var url = 'https://metal-slug.herokuapp.com/login?' + $.param(credentials);

    parse.initialize();

    $.get(url).then(data => {
      var newUser = new User(data);
      User.store(newUser);
      callback(newUser);
    });

    parse.deinitialize();

  },
  signup: function(creds){
    var newUser = new User(creds);
    newUser.save().then(() => {
      User.store(newUser);
    });
    return newUser;
  },
  store: function(user){
    localStorage.setItem('user', JSON.stringify(user.toJSON()));
  },
  current: function(){
    var user = localStorage.getItem('user');

    // if no user in local storage, bail
    if(!user){
      return false;
    }

    var currentUser = new User(JSON.parse(user));

    // If we don't have a token, bail
    if(!currentUser.get('sessionToken')){
      return false;
    }

    return currentUser;
  }
});

module.exports = {
  User
};
