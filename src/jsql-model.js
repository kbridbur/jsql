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
    console.log(source);
    console.log();
    console.log(jsqlCode);
    return [];
  }
}

module.exports = JSQLModel;
