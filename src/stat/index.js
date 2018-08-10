/**
 * @fileOverview Stat
 * @author leungwensen@gmail.com
 */
const G2 = require('../core');
const View = require('../chart/view');
const Util = require('../util');

G2._Stats = {};
G2.registerStat = function(type, constructor) {
  G2._Stats[type] = constructor;
};
G2.getStat = function(type) {
  return G2._Stats[type];
};

View.prototype.getStats = function() {
  const me = this;
  if (!me._stats) {
    me._stats = [];
  }
  return me._stats;
};

View.prototype.stat = function(options) {
  const me = this;
  me._statFields = me._statFields || {};
  me._executeStat(options);
  me.getStats().push(options);
  return me;
};

View.prototype._executeStat = function(options = { type: 'default' }) {
  const me = this;
  if (Util.isPlainObject(options)) {
    const stat = G2.getStat(options.type);
    stat(me, me.get('data'), options);
  } else if (Util.isArray(options)) {
    let currentResult = me.get('data');
    for (let i = 0; i < options.length; i += 0) {
      const _options = options[i];
      const stat = G2.getStat(_options.type || 'default');
      currentResult = stat(me, currentResult, _options);
    }
  }
};

View.prototype._reExecuteStats = function() {
  const me = this;
  // refreshing fields
  me._statFields = me._statFields || {};
  const stats = me.getStats();
  Util.each(stats, stat => {
    me._executeStat(stat);
  });
};

const stats = {
  default: require('./default'),
  aggregate: require('./aggregate')
};

G2.registerStat('default', stats.default);
G2.registerStat('aggregate', stats.aggregate);
G2.registerStat('summary', stats.aggregate);

module.exports = stats;
