// Javascript Query Language
// @author Anthony Liu

var JSQL = require('./jsql');

class JSQLModel {
  constructor(modelName, schema) {
    this.modelName = modelName;
    this.schema = schema;
    this.jsql = new JSQL(schema);
  }

  map(f) {
    var source = this.modelName + '.map(';
    source += f.toString();
    source += ')';
    return this.execute(source);
  }

  execute(source) {
    var jsqlCode = this.jsql.compile(source);
    return jsqlCode;
  }
}

module.exports = JSQLModel;
