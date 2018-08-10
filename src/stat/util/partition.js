
const Util = require('../../util');

module.exports = (rows, group_by, order_by = []) => {
  let newRows = rows;
  if (order_by && order_by.length) {
    newRows = Util.sortBy(rows, order_by);
  }

  let groupingFn;
  if (Util.isFunction(group_by)) {
    groupingFn = group_by;
  } else if (Util.isArray(group_by)) {
    groupingFn = row => `_${group_by.map(col => row[col]).join('-')}`;
    // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
    // that is why we have to add a prefix
  } else if (Util.isString(group_by)) {
    groupingFn = row => `_${row[group_by]}`;
  }
  const groups = Util.groupBy(newRows, groupingFn);
  return groups;
};
