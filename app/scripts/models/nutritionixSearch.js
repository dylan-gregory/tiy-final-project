var $ = require('jquery');
var Backbone = require('backbone');


var Nutritionix = Backbone.Model.extend({
  search: function(search){

    var searchResults;

    $.post({
        url: "https://api.nutritionix.com/v1_1/search",
        data:
          {
           "appId":"88de8f71",
           "appKey":"b14e1f98119937669fe17c9df1aa91ec",
           "fields": [
             "item_name",
             "nf_calories"
           ],
           "query": search
         }

    }).then(function(data){
      searchResults = data;
      console.log('search results', data);
    });


    return searchResults;
  }
});

module.exports = {
  Nutritionix
};
