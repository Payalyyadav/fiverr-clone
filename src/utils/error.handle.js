

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;  // A flag to indicate if the error is operational (user-defined)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;
