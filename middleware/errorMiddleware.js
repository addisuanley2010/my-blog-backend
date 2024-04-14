// 404 not found error

const notFound = (req, res, next) => {
  const error = new Error(`This url ${req.originalUrl} is not found`);
  next(error);
};

// handle error middleware

const handleError = (error, req, res, next) => {
  res.status(500).json({
    message: error.message || "Unknown Error Happened",
  });
  next()
};

module.exports = { notFound, handleError };
