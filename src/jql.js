// Javascript Query Language
// @author Anthony Liu

var esprima = require('esprima');
var Select = require('./sql/select');

class Compiler {
  constructor(schema) {
    this.schema = schema;
    this.select = new Select();
  }

  compile(query) {
    var tree = esprima.parse(query);
    var expression = tree.body[0].expression;
    var entryPoint = expression.callee.object.name;
    var databaseInfo = this.schema.Database[entryPoint];

    this.select.enter(databaseInfo.start);

    var mapBody = expression.arguments[0].body.body;
    var returnValue = mapBody[0].argument;
    var property = returnValue.property.name;

    this.select.addColumn(property);

    return this.select.getMysql();
  }
}

module.exports = Compiler;
