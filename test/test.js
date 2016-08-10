var assert = require('assert');
var JQL = require('../src/jql');
var PersonSchema = require('../src/schemas/person');

describe('Compiler', function() {
  describe('#compile()', function() {
    // single primitive column
    it('should properly select for a single primitive column', function() {
      var compiler = new JQL(PersonSchema);
      var query = 'people.map(function(person){return person.name;})';
      var result = {
        sql: 'SELECT name FROM PeopleTable',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // single primitive column in an object
    it('should properly select for simple objects', function() {
      var compiler = new JQL(PersonSchema);
      var query = `
        people.map(function(person) {
          return {
            'their name': person.name
          };
        })
      `;
      var result = {
        sql: 'SELECT name AS "their name" FROM PeopleTable',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // two primitive columns in an object
    it('should properly select for simple objects', function() {
      var compiler = new JQL(PersonSchema);
      var query = `
        people.map(function(person) {
          return {
            'their name': person.name,
            'their age': person.age
          };
        })
      `;
      var result = {
        sql: 'SELECT name AS "their name", age AS "their age" FROM PeopleTable',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });
  });
});
