const sanitizeBlackList = (object, forbiddenFields) => {
  const sanitizedObject = {};
  Object.keys(object).forEach((key) => {
    if (!forbiddenFields.includes(key)) {
      sanitizedObject[key] = object[key];
    }
  });
  return sanitizedObject;
};

exports.sanitizeBlackList = sanitizeBlackList;

exports.sanitizeBodyBlackList = (...forbiddenFields) => {
  return async (req, res, next) => {
    req.body = sanitizeBlackList(req.body, forbiddenFields);
    next();
  };
};

const sanitizeWhiteList = (object, allowedFields) => {
  const sanitizedObject = {};
  Object.keys(object).forEach((key) => {
    if (allowedFields.includes(key)) {
      sanitizedObject[key] = object[key];
    }
  });
  return sanitizedObject;
};

exports.sanitizeWhiteList = sanitizeWhiteList;

exports.sanitizeBodyWhiteList = (...allowedFields) => {
  return async (req, res, next) => {
    req.body = sanitizeWhiteList(req.body, allowedFields);
    next();
  };
};
