var Backbone = require('backbone');

var parse = require('../setup').parse;

var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
  sync: function(){
    var User = require('./user.js').User;
    var user = User.current();

    if(user){
      parse.initialize({sessionId: user.get('sessionToken')});
    }else{
      parse.initialize();
    }


    var xhr = Backbone.Model.prototype.sync.apply(this, arguments);

    parse.deinitialize();

    return xhr;
  },
  save: function(key, val, options){
    delete this.attributes.createdAt;
    delete this.attributes.updatedAt;

    return Backbone.Model.prototype.save.apply(this, arguments);
  },
  setPointer: function(field, parseClass, objectId){
    var pointerObject = {
      "__type": "Pointer",
      "className": parseClass,
      "objectId": objectId
    };

    this.set(field, pointerObject);

    return this;
  }
});

var ParseCollection = Backbone.Collection.extend({
  whereClause: {},
  parseWhere: function(field, value, objectId){
    // If an objectId is passed in then we are building a pointer where
    if(objectId){
      value = {
        field: field,
        className: value,
        objectId: objectId,
        '__type': 'Pointer'
      };
    }

    // // Check if the field has a search option set
    // if(field.indexOf('$') !== -1){
    //   var search = field.split('$');
    //   field = search[0];
    //   var comparison = '$' + search[1];
    //
    //   var clause = {};
    //   clause[comparison] = value;
    //   value = clause;
    // }

    this.whereClause[field] = value;

    return this;
  },
  url: function(){
    var url = this.baseUrl;

    if(Object.keys(this.whereClause).length > 0){
      url += '?where=' + JSON.stringify(this.whereClause);
      this.whereClause = {};
    }

    return url;
  },
  parse: function(data){
    return data.results;
  },
  sync: function(){
    var User = require('./user.js').User;
    var user = User.current();

    if(user){
      parse.initialize({sessionId: user.get('sessionToken')});
    }else{
      parse.initialize();
    }

    var xhr = Backbone.Collection.prototype.sync.apply(this, arguments);

    parse.deinitialize();

    return xhr;
  }
});


var Coach = ParseModel.extend({
  defaults: function(){
    return {
      name: '',
      avatar: '',
      clients: new ClientCollection(),
      coachId: '',

    }
  }
});


//coachID will be their objectId


var CoachCollection = ParseCollection.extend({
  model: Coach,
  baseUrl: 'https://metal-slug.herokuapp.com/users'
});



var Client = ParseModel.extend({
  defaults: function(){
    return {
      name: '',
      avatar: '',
      todos: new TodoCollection(),
      coachId: '',
      stars: 0

    }
  }
});

// coachId will be their coach's objectId

var ClientCollection = ParseCollection.extend({
  model: Client,
  baseUrl: 'https://metal-slug.herokuapp.com/users'
});

var Todo = ParseModel.extend({
  defaults: function() {
    return {
      title: '',
      dueDate: '',
      notes: '',
      isComplete: false,
      isEditing: false
    }
  }
});

var TodoCollection = ParseCollection.extend({
  model: Todo,
  url: 'https://metal-slug.herokuapp.com/classes/clientTasks'
});

var Detail = ParseModel.extend({
  defaults: {
    stars: 0
  }
});

var DetailCollection = ParseCollection.extend({
  model: Detail,
  comparator: -'stars',
  url: 'https://metal-slug.herokuapp.com/classes/clientDetails'

});

var DailyValue = ParseModel.extend({

});

var DailyValueCollection = ParseCollection.extend({
  model: DailyValue,
  url: 'https://metal-slug.herokuapp.com/classes/dailyValues'
});

module.exports = {
  Coach,
  CoachCollection,
  Client,
  ClientCollection,
  Todo,
  TodoCollection,
  ParseModel,
  Detail,
  DetailCollection,
  DailyValueCollection,
  DailyValue
};
