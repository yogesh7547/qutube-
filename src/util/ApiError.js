class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


export {ApiError}




//class ApiError extends Error
/*
custom error class that extends JavaScript's built-in Error class.
*/
//constructor- This defines what information you need to provide when creating a new API error:

// statusCode: HTTP status code (like 404, 500, 400)
// message: What went wrong (with a default backup message)
// errors: Array of detailed error information
// stack: Optional stack trace (debugging information)


//super(message);- you're telling the parent Error class to initialize itself with the message you provide. The built-in Error class has a message property, and super(message) sets that property.


//Error.captureStackTrace(this, this.constructor);
//Error.captureStackTrace(targetObject, constructorToExclude);
//Node.js-specific method that creates a stack trace (a list of function calls that led to this point in your code) and attaches it to an error object.