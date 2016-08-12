var people = require('../src/models/people');

// debugging
people.map(function(person) {
  return {
    'their name': person.name,
    'their hometown': person.home.city
  };
})
