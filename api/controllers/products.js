const asyncWrapper = require('../middlewares/asyncWrapper');
const Products = require('../models/products');

const getAllProducts = asyncWrapper( async (request, response) => {

    /**
     * Fetching the query values for the filter.
     */    
    const { name, featured, company, sortBy, orderBy, page, numericFilters } = request.query;

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
         * Made multiple `sortBy` values, prioritization is based on the chronological order in array.
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

    if (numericFilters) {
        /**
         * There are `numericFilters` request query declared. 
         */
        const operatorsMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        };

        //Replacing `operatorsMap` symbol with mongoose values using regex.
        const regex = /\b(<|>|>=|=|<|<=)\b/g;
        const replacedOperatorsNumericFilters = numericFilters.replace(regex, (match) => `-${operatorsMap[match]}-`);

        //Declare here all product values that has numeric type and will be using values from operatorsMap.
        const numericOptions = ['price', 'rating'];

        replacedOperatorsNumericFilters.split(',').map(filter => {
            const [indentifier, condition, value] = filter.split('-');
            if (numericOptions.includes(indentifier)) {
                objectFilters[indentifier] = {[condition]: Number(value)};
            }
        });
    }

    //For pagination purposes
    const selectedPage = page || 1;
    const limit = 10;
    const skip = (selectedPage - 1) * limit;

    //The filtered and paginated products to return on frontend
    const filteredPaginatedProducts = await Products.find(objectFilters).sort(sortFilters).skip(skip).limit(limit);
    
    //Counting all products that are filtered with `objectFilters` for pagination purposes
    const totalItemCount = await Products.count(objectFilters);

    response.json({ 
        count: filteredPaginatedProducts.length,
        totalItemCount: totalItemCount, 
        totalPages: Math.ceil(totalItemCount/limit),
        products: filteredPaginatedProducts 
    });

});

module.exports = {
    getAllProducts
}