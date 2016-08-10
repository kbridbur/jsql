// Javascript Query Language
// @author Anthony Liu

var esprima = require('esprima');
var squel = require('squel');

class Compiler {
  constructor(schema) {
    this.schema = schema;
    this.select = squel.select();
    this.tables = [];

    this.currentModel = null;
    this.variable = null;
    this.index = null;

    this.modelToTableMapping = {};
    for (var model in this.schema.Database) {
      var modelInfo = this.schema.Database[model];
      this.modelToTableMapping[modelInfo.content] = modelInfo.table;
    }
  }

  compile(query) {
    var tree = esprima.parse(query);
    var expression = tree.body[0].expression;
    var entryPoint = expression.callee.object.name;
    var databaseInfo = this.schema.Database[entryPoint];

    this.enterTable(databaseInfo.table);
    this.currentModel = databaseInfo.content;
    this.variable = expression.arguments[0].params.name;

    var mapBody = expression.arguments[0].body.body;
    var returnValue = mapBody[0].argument;
    this.getReturnValue(returnValue);

    return {
      sql: this.select.toString(),
      js: ''
    };
  }

  enterTable(table) {
    this.tables.push(table);
    this.index = 0;
    this.select.from(table, this.index.toString());
  }

  getReturnValue(returnValue) {
    switch (returnValue.type) {
      case 'MemberExpression':
        var property = this.getProperty(returnValue);
        this.getColumnInContext(property);
        break;

      case 'ObjectExpression':
        for (var pair of returnValue.properties) {
          var property = this.getProperty(pair.value);
          this.getColumnInContext(
            property,
            pair.key.value
          );
        }
        break;
    }
  }

  getProperty(path) {
    var objectContext = path.object;
    if ('name' in objectContext) {
      return path.property.name;
    } else {
      var property = this.getProperty(path.object);
      var nextModel = this.schema[this.currentModel][property];
      var table = this.modelToTableMapping[nextModel];
      this.joinToTable(property, table);
      return path.property.name;
    }
    return path; 
  }

  joinToTable(column, table) {
    this.tables.push(table); 
    this.index += 1;
    this.select.join(
      table,
      this.index.toString(),
      '`' + (this.index-1) + '`.' + column + ' = `' + this.index + '`.id'
    )
  }

  getColumnInContext(column, alias) {
    var prefix = '`' + this.index + '`.';
    this.select.field(prefix + column, alias);
  }
}

module.exports = Compiler;
