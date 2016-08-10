var primitives = require('./primitives');
var String = primitives.String;
var Int = primitives.Int;

// ASSUMPTIONS
//  * all top-level objects have an implied, unique, primary key called 'id'
//  * all object references are actually an object's id

/*

=== `Person` table ===
id   name age  spouse
0    Adam  28  1
1    Beth  27  0
2    Carl  52  3
3    Dala  53  2

=== Schema format ===
{
  Database: {
    ${abstract model name}: {
      start: ${SQL table name},
      content: ${the type of object that the abstract model name represents}
    },
    ...
  },
  
  ${type name}: {
    ${property name}: ${property type},
    ...
  },
  ...
}
*/

module.exports = {
  Database: {
    people: {
      table: 'PeopleTable',
      content: 'Person'
    }
  },

  Person: {
    name: String,
    age: Int,
    spouse: 'Person'
  }
};
