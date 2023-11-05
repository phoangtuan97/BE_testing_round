// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: err.status || 500,
        message: err.message || 'Internal error',
    });
}

module.exports = errorHandler;
