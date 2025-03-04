const { StatusCodes } = require("http-status-codes");

// having next in params is necessary for this run as an error handler, or else this middleware is skipped by pipeline.
const errorHandler = (err, req, res, next) => {
    let customError = {
        message: err.message || "Something went wrong please try again later",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
    if (err.code && err.code === '42703') {
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if (customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
        console.error(err)
    }
    console.error(err)
    res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandler;