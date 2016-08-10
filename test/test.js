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
        sql: 'SELECT `0`.name FROM PeopleTable `0`',
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
        sql: 'SELECT `0`.name AS "their name" FROM PeopleTable `0`',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // two primitive columns in an object
    it('should properly select for objects with multiple properties', function() {
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
        sql: 'SELECT `0`.name AS "their name", `0`.age AS "their age" FROM PeopleTable `0`',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // requires a join
    it('should properly select for properties that require joins', function() {
      var compiler = new JQL(PersonSchema);
      var query = `
        people.map(function(person) {
          return person.spouse.name;
        })
      `;
      var result = {
        sql: 'SELECT `1`.name FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN PeopleTable `1` ON' +
            ' (`0`.spouse = `1`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // an object with a property that requires a join
    it('should properly select for objects with properties that require joins', function() {
      var compiler = new JQL(PersonSchema);
      var query = `
        people.map(function(person) {
          return {  
            'their age': person.age,
            'spouse name': person.spouse.name
          };
        })
      `;
      var result = {
        sql: 'SELECT `0`.age AS "their age", `1`.name AS "spouse name" FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN PeopleTable `1` ON' +
            ' (`0`.spouse = `1`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });
  });
});
