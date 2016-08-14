var people = require('../src/models/people');

// debugging
var sql = people.map(function(person) {
  return person.home;
})

console.log(sql);
