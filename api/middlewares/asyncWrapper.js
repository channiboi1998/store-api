const asyncWrapper = (fn) => {
    return (request, response, next) => {
        try {
            await fn(request, response, next);
        } catch(error) {
            next(error);
        }
    }
}

module.exports = asyncWrapper;