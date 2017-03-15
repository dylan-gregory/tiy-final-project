var Backbone = require('backbone');

var parse = require('../setup');

var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
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
      isComplete: false
    }
  }
});

var TodoCollection = ParseCollection.extend({
  model: Todo,
  url: 'https://metal-slug.herokuapp.com/classes/clientTasks'
});

var Detail = ParseModel.extend({

});

var DetailCollection = ParseCollection.extend({
  model: Detail,
  url: 'https://metal-slug.herokuapp.com/classes/clientDetails'
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
  DetailCollection
};
