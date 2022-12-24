const Products = require('../models/products');

const getAllProducts = async (request, response) => {

    /**
     * Fetching the query values for the filter.
     */    
    const { name, featured, company, sortBy, orderBy } = request.query;

    //Object that will accept the query filters' keys and values
    const objectFilters = {};
    //Object that will accept the sort filters' keys and values.
    const sortFilters = {};

    if (name) {
        //There is a name query filter, attatching it to the `objectFilters` object.
        objectFilters.name = { $regex: name, $options: 'i' };
    }

    if (featured) {
         //There is a featured query filter, attatching it to the `objectFilters` object.
        objectFilters.featured = featured === true ? true : false;
    }

    if (company) {
         //That there is a company query filter, attatching it to the `objectFilters` object.
        objectFilters.company = { $regex: company, $options: 'i' };
    }

    if (sortBy) {
        /**
         * There are value/s declared on the `sortBy` query filter, split them up and attatch each keys and values to `sortFilters` object.
         */
        let sortParameters = sortBy.split(',');
        let orderByAscDesc = -1;    
    
        if (orderBy) {
            //There is a declared `orderBy` value, set either ASC or DESC
            orderByAscDesc = orderBy === 'ASC' ? 1 : -1;
        }

        sortParameters.map(sortParameter => {
            sortFilters[sortParameter] = orderByAscDesc;
        });

    }

    const products = await Products.find(objectFilters).sort(sortFilters);
    response.json({ nbHits: products.length, products: products });

}   

module.exports = {
    getAllProducts
}