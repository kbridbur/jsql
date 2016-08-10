var assert = require('assert');
var JQL = require('../src/jql');
var PersonSchema = require('../src/schemas/person');

describe('Compiler', function() {
  describe('#compile()', function() {
    it('should properly select primitive columns', function() {
      var compiler = new JQL(PersonSchema);
      var query = 'people.map(function(person){return person.name;})';
      var sql = 'SELECT `name` FROM `PeopleTable`';
      assert.equal(
        compiler.compile(query), sql
      );
    });
  });
});
