var squel = require('squel');
var JQL = require('./jql');
var PersonSchema = require('../src/schemas/person');

// debugging
var compiler = new JQL(PersonSchema);
var query = `
  people.map(function(person) {
    return person.home.city;
  })
`;

console.log(
  compiler.compile(query)
);
