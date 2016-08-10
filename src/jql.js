// Javascript Query Language
// @author Anthony Liu

var esprima = require('esprima');
var squel = require('squel');

class Compiler {
  constructor(schema) {
    this.schema = schema;
    this.select = squel.select();
  }

  compile(query) {
    var tree = esprima.parse(query);
    var expression = tree.body[0].expression;
    var entryPoint = expression.callee.object.name;
    var databaseInfo = this.schema.Database[entryPoint];

    this.select.from(databaseInfo.start);

    var mapBody = expression.arguments[0].body.body;
    var returnValue = mapBody[0].argument;

    switch (returnValue.type) {
      case 'MemberExpression':
        var property = returnValue.property.name;
        this.select.field(property);
        break;

      case 'ObjectExpression':
        for (var property of returnValue.properties) {
          this.select.field(property.value.property.name, property.key.value);
        }
        break;
    }

    return {
      sql: this.select.toString(),
      js: ''
    };
  }
}

module.exports = Compiler;
