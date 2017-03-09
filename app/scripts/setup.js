var $ = require('jquery');

/**
 * User authentication requests with Parse server
 **/

var parse = {
  BASE_API_URL: '',
  setup: function(config){
    if (config.BASE_API_URL){
      this.BASE_API_URL = config.BASE_API_URL;
    }

    $.ajaxSetup({
      beforeSend: function(xhr){
        xhr.setRequestHeader("X-Parse-Application-Id", "tiygvl");
        xhr.setRequestHeader("X-Parse-REST-API-Key", "slumber");

        if(config.sessionId){
          xhr.setRequestHeader("X-Parse-Session-Token", config.sessionId);
        }
      }
    });
  }
}

/**
 * Nutritionix API request may go here?
 **/

module.exports = parse;