var assert = require('assert');
var JSQL = require('../src/jsql');
var people = require('../src/models/people');

describe('Compiler', function() {
  describe('#compile()', function() {
    // single primitive column
    it('should properly select a single primitive column', function() {
      var compiler = new JSQL(people.schema);
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
    it('should properly select simple objects', function() {
      var compiler = new JSQL(people.schema);
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
    it('should properly select objects with multiple properties', function() {
      var compiler = new JSQL(people.schema);
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

    // requires a same-table join
    it('should properly select properties that require same-table joins', function() {
      var compiler = new JSQL(people.schema);
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

    // an object with a property that requires a same-table join
    it('should properly select objects that require same-table joins', function() {
      var compiler = new JSQL(people.schema);
      var query = `
        people.map(function(person) {
          return {  
            'their age': person.age,
            'spouses name': person.spouse.name
          };
        })
      `;
      var result = {
        sql: 'SELECT `0`.age AS "their age", `1`.name AS "spouses name" FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN PeopleTable `1` ON' +
            ' (`0`.spouse = `1`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // an object with a property that requires two same-table joins
    it('should properly select objects that require two same-table joins', function() {
      var compiler = new JSQL(people.schema);
      var query = `
        people.map(function(person) {
          return {  
            'their age': person.age,
            'spouses spouses name': person.spouse.spouse.name
          };
        })
      `;
      var result = {
        sql: 'SELECT `0`.age AS "their age", `2`.name AS "spouses spouses name" FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN PeopleTable `1` ON' +
            ' (`0`.spouse = `1`.id)'+
            ' INNER JOIN PeopleTable `2` ON' +
            ' (`1`.spouse = `2`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // requires a cross-table join
    it('should properly select properties that require cross-table joins', function() {
      var compiler = new JSQL(people.schema);
      var query = `
        people.map(function(person) {
          return person.home.city;
        })
      `;
      var result = {
        sql: 'SELECT `1`.city FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN AddressTable `1` ON' +
            ' (`0`.home = `1`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // selecting an object as a property
    it('should properly select properties that are actually objects', function() {
      var compiler = new JSQL(people.schema);
      var query = `
        people.map(function(person) {
          return person.home;
        })
      `;
      var result = {
        sql: 'SELECT `1`.* FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN AddressTable `1` ON' +
            ' (`0`.home = `1`.id)',
        js: ''
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });

    // should allow for one-to-many joins
    it('should properly select properties that represent arrays of values', function() {
      var compiler = new JSQL(people.schema);
      var query = `
        people.map(function(person) {
          return person.pets;
        })
      `;
      var result = {
        sql: 'SELECT `0`.id, `1`.* FROM' +
            ' PeopleTable `0`' +
            ' INNER JOIN PetsTable `1` ON' +
            ' (`0`.id = `1`.owner)', // TODO: check sql
        js: '// consolidate the pets to their owners' // TODO: write javascript
      };
      assert.deepEqual(
        compiler.compile(query), result
      );
    });
  });
});
