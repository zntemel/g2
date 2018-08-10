const Util = require('../../util');
const INVALID_FIELD_ERR_MSG = 'Invalid field: it must be a string!';
const INVALID_FIELDS_ERR_MSG = 'Invalid fields: it must be an array!';

module.exports = {
  getField(options, defaultField) {
    const { field, fields } = options;
    if (Util.isString(field)) {
      return field;
    }
    if (Util.isArray(field)) {
      console.warn(INVALID_FIELD_ERR_MSG);
      return field[0];
    }
    console.warn(`${INVALID_FIELD_ERR_MSG} will try to get fields instead.`);
    if (Util.isString(fields)) {
      return fields;
    }
    if (Util.isArray(fields) && fields.length) {
      return fields[0];
    }
    if (defaultField) {
      return defaultField;
    }
    throw new TypeError(INVALID_FIELD_ERR_MSG);
  },
  getFields(options, defaultFields) {
    const { field, fields } = options;
    if (Util.isArray(fields)) {
      return fields;
    }
    if (Util.isString(fields)) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return [ fields ];
    }
    console.warn(`${INVALID_FIELDS_ERR_MSG} will try to get field instead.`);
    if (Util.isString(field)) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return [ field ];
    }
    if (Util.isArray(field) && field.length) {
      console.warn(INVALID_FIELDS_ERR_MSG);
      return field;
    }
    if (defaultFields) {
      return defaultFields;
    }
    throw new TypeError(INVALID_FIELDS_ERR_MSG);
  }
};
