class Select {
  constructor() {
    this.table = null;
    this.columns = [];
  }

  getMysql() {
    return 'SELECT ' + this.getColumns() +
      ' FROM ' + Select.bury(this.table);
  }

  enter(table) {
    this.table = table;
  }

  addColumn(column) {
    this.columns.push(column);
  }

  getColumns() {
    return this.columns.map(Select.bury).join(', ');
  }

  static bury(a) {
    return '`' + a + '`';
  }
}

module.exports = Select;
