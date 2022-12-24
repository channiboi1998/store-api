const notFound = (request, response) => {
    response.status(400).json("Route not Found!");
}

module.exports = notFound;