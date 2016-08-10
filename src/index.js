var squel = require('squel');
var JQL = require('./jql');
var PersonSchema = require('../src/schemas/person');

// debugging
var compiler = new JQL(PersonSchema);
var query = `
  people.map(function(person) {
    return {  
      'their age': person.age,
      'spouse name': person.spouse.name
    };
  })
`;

console.log(
  compiler.compile(query)
);
