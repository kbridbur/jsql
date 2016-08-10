var primitives = require('./primitives');
var String = primitives.String;
var Int = primitives.Int;

// ASSUMPTIONS
//  * all top-level objects have an implied, unique, primary key called 'id'
//  * all object references are actually an object's id

/*

=== SQL commands ===
DROP TABLE IF EXISTS `PeopleTable`;
DROP TABLE IF EXISTS `AddressTable`;

CREATE TABLE `PeopleTable` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(256) NOT NULL,
  `age` INT UNSIGNED NOT NULL,
  `spouse` INT UNSIGNED,
  `home` INT UNSIGNED
);

CREATE TABLE `AddressTable` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `country` VARCHAR(256) NOT NULL,
  `state` VARCHAR(256) NOT NULL,
  `city` VARCHAR(256) NOT NULL,
  `zip` INT UNSIGNED
);

INSERT INTO `PeopleTable` (`id`, `name`, `age`, `spouse`, `home`)
     VALUES (1, 'Adam', 28, 2, 1),
            (2, 'Beth', 27, 1, 1),
            (3, 'Carl', 52, 4, 2),
            (4, 'Dala', 53, 3, 2); 

INSERT INTO `AddressTable` (`id`, `country`, `state`, `city`, `zip`)
     VALUES (1, 'USA', 'CA', 'Pacifica', 94044),
            (2, 'USA', 'MA', 'Boston', 02139);

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
    },

    addresses: {
      table: 'AddressTable',
      content: 'Address'
    }
  },

  Person: {
    name: String,
    age: Int,
    spouse: 'Person',
    home: 'Address'
  },

  Address: {
    country: String,
    state: String,
    city: String,
    zip: Int 
  }
};
