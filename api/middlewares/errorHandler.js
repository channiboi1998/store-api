const errorHandler = (error, request, response, next) => {
    console.log("There has been an error:", error);
    response.status(500).json(error);
}

module.exports = errorHandler;

