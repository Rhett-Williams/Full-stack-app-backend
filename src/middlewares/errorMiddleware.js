// Error middleware function for handling 404 rout errors
const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}


// Error middleware function for handling errors (throw new Error stuff)
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        error: true,
        errorMessage: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}



// Exporting middleware functions to be used in index.js
export { notFound, errorHandler }; 