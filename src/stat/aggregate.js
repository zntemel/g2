const simpleStatistics = require('simple-statistics');
const Util = require('../util');
const partition = require('./util/partition');
const STATISTICS_METHODS = require('./constants/STATISTICS_METHODS');
const {
  getFields
} = require('./util/optionParser');

const DEFAULT_OPTIONS = {
  as: [],
  fields: [],
  groupBy: [],
  operations: []
};
const DEFAULT_OPERATION = 'count';

const aggregates = {
  count(data) {
    return data.length;
  },
  distinct(data, field) {
    const values = Util.uniq(data.map(row => row[field]));
    return values.length;
  }
};
STATISTICS_METHODS.forEach(method => {
  aggregates[method] = (data, field) => {
    let values = data.map(row => row[field]);
    if (Util.isArray(values) && Util.isArray(values[0])) {
      values = Util.flattenDeep(values);
    }
    return simpleStatistics[method](values);
  };
});
aggregates.average = aggregates.mean;

module.exports = (view, data, options) => {
  data = Util.clone(data);
  options = Util.mix({}, DEFAULT_OPTIONS, options);
  const dims = options.groupBy;
  const fields = getFields(options);
  if (!Util.isArray(fields)) {
    throw new TypeError('Invalid fields: it must be an array with one or more strings!');
  }
  let outputNames = options.as || [];
  if (Util.isString(outputNames)) {
    outputNames = [ outputNames ];
  }
  let operations = options.operations;
  if (Util.isString(operations)) {
    operations = [ operations ];
  }
  const DEFAULT_OPERATIONS = [ DEFAULT_OPERATION ];
  if (!Util.isArray(operations) || !operations.length) {
    console.warn('operations is not defined, will use [ "count" ] directly.');
    operations = DEFAULT_OPERATIONS;
    outputNames = operations;
  }
  if (!(operations.length === 1 && operations[0] === DEFAULT_OPERATION)) {
    if (operations.length !== fields.length) {
      throw new TypeError('Invalid operations: it\'s length must be the same as fields!');
    }
    if (outputNames.length !== fields.length) {
      throw new TypeError('Invalid as: it\'s length must be the same as fields!');
    }
  }
  const groups = partition(data, dims);
  const results = [];
  Util.each(groups, group => {
    // const result = pick(group[0], dims);
    const result = group[0];
    operations.forEach((operation, i) => {
      const outputName = outputNames[i];
      const field = fields[i];
      result[outputName] = aggregates[operation](group, field);
      // view injecting
      view._statFields[outputName] = {
        originField: field,
        results
      };
    });
    results.push(result);
  });
  return results;
};
