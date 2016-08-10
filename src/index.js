var JQL = require('./jql');
var PersonSchema = require('../src/schemas/person');

var compiler = new JQL(PersonSchema);
var query = 'people.map(function(person){return person.name;})';

console.log(
  compiler.compile(query)
);
