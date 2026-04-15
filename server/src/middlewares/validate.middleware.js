export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    if (property === "query") {
      req.validatedQuery = value;
    } else if (property === "params") {
      req.validatedParams = value;
    } else {
      req[property] = value;
    }

    next();
  };
};