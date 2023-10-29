// This is a function that creates middleware to require a string parameter in the request body.
const requireStringParam = (paramName, validator = null) => {
  return (request, response, next) => {
    const value = request.body[paramName];
    if (value) {
      if (typeof value !== 'string')
        return response.status(400).json({ message: `Param: ${paramName} must be string` });
      if (validator && !validator(value))
        return response.status(400).json({ message: `Validator failed for string param: ${paramName}` });
      return next();
    }
    return response.status(400).json({ message: `Required string param: ${paramName}` });
  };
};

module.exports = { requireStringParam };
