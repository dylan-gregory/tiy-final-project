var chai = require('chai');
var expect = chai.expect;
var $ = require('jquery');

var TodoCollection = require('../app/scripts/models/models.js').TodoCollection;

// ##############################################
// Model Tests
// ##############################################

describe('TodoCollection', function(){

  describe('should return a promise', function(){
    var promise = TodoCollection.fetch();
    expect(promise).to.respondTo('then');
  });

  it('should resolve with an array of todos', function(done){
    TodoCollection.fetch().then(data =>{
      var todo = data[0];

      expect(todo).to.have.property('title');
      expect(todo).to.have.property('dueDate');
      expect(todo).to.have.property('notes');

      done();
    })
  });

});
