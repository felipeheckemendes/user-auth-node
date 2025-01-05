const { inHTMLData } = require('xss-filters');

/**
 * Clean for xss.
 * @param {string/object} data - The value to sanitize
 * @return {string/object} The sanitized value
 */
function clean(data = '') {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
}

module.exports = function () {
  return (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);
    next();
  };
};
