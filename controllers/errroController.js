const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong'
    });
  }
};

const handleCastErrorDb = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleJWTError = (error) => {
  return new AppError('Invalid Token.Please Login Again', 401)
}

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    sendErrorProd(error, res);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
  }
};

module.exports = errorController;
