const { StatusCodes } = require("http-status-codes");
const { DB_CONN_REFUSED, DB_TIME_OUT, DB_INVALID_COL, DB_CONN_FAIL_MSG, DB_QUERY_TO, GENERIC_ERR_MSG } = require('../constants/error-messages')

// having next in params is necessary for this run as an error handler, or else this middleware is skipped by pipeline.
const errorHandler = (err, req, res, next) => {
    let customError = {
        message: err.message || GENERIC_ERR_MSG,
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
    if (err.code && err.code === DB_INVALID_COL) {
        customError.statusCode = StatusCodes.BAD_REQUEST
    } else if (err.code && err.code === DB_CONN_REFUSED) { // db connect failed
        customError.statusCode = StatusCodes.SERVICE_UNAVAILABLE
        customError.message = DB_CONN_FAIL_MSG
    } else if (err.code && err.code === DB_TIME_OUT) { // db timed out
        customError.statusCode = StatusCodes.GATEWAY_TIMEOUT
        customError.message = DB_QUERY_TO
    } else if (err.code && err.code === 'INSUFFICIENT_STOCK') {
        return res.status(err.statusCode).json({ message: err.message, code: err.code, items: err.items })
    }
    console.error(err)
    res.status(customError.statusCode).json({ error: customError.message });
};

module.exports = errorHandler;