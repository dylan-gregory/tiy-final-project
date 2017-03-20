var $ = require('jquery');
var Backbone = require('backbone');


var Search = Backbone.Model.extend({

});


var Nutritionix = Backbone.Collection.extend({
  model: Search,
  url: "https://api.nutritionix.com/v1_1/search",
  sync: function(method, collection, options){
    options = options || {};
    options.emulateJSON = true;
    options.data = {
      "appId":"88de8f71",
       "appKey":"b14e1f98119937669fe17c9df1aa91ec",
       "fields": [
         "item_name",
         "nf_calories",
         "nf_sugars",
         "item_description",
         "nf_sodium",
         "nf_cholesterol",
         "nf_total_carbohydrate",
         "nf_serving_size_qty",
         "nf_serving_size_unit"
       ],
       "limit": "20",
       "query": this.searchTerm
    };

    return Backbone.Collection.prototype.sync.call(this, 'create', collection, options);
  },
  search: function(searchTerm){
    this.searchTerm = searchTerm;

    return this.fetch();
  },
  parse: function(data){
    return data.results;
  }
});

module.exports = {
  Nutritionix
};
