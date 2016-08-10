// Javascript Query Language
// @author Anthony Liu

var esprima = require('esprima');

class Compiler {
  constructor(schema) {
    this.schema = schema;
  }

  compile(query) {
    var tree = esprima.parse(query);
    console.log(JSON.stringify(tree, null, 4));
    return 'SELECT * FROM *';
  };
}

module.exports = Compiler;
