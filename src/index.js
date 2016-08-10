var JQL = require('./jql');
var PersonSchema = require('../src/schemas/person');

var compiler = new JQL(PersonSchema);
var query = 'people.map(function(person){return {"their name": person.name};})';

console.log(
  compiler.compile(query)
);
