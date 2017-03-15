var Backbone = require('backbone');

var ParseModel = require('./models.js').ParseModel;

var ParseFile = ParseModel.extend({
  urlRoot: function(){
    return 'https://metal-slug.herokuapp.com/files/' + this.get('name');
  }
});

module.exports = {
  ParseFile
}
