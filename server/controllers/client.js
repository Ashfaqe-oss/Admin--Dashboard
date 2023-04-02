import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";


export const getProducts = async(req, res) => {
    try {
        const products = await Product.find(); //getting all the products

        const productsWithStats = await Promise.all(
            products.map(async(product) => {
                const stat = await ProductStat.find({
                    productId: product._id,
                });
                return {
                    ...product._doc,
                    stat, //combining both product data + stat data
                };
            })
        ); //it is slow so -- use aggregate functions

        res.status(200).json(productsWithStats); //sending json
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getCustomers = async(req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password"); //we are excluding the password field from being fetched
        res.status(200).json(customers); //if role is user --> then he is a customer
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTransactions = async(req, res) => {
    try {
        // sort should look like this: { "field": "userId", "sort": "desc"}
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        // formatted sort should look like { userId: -1 }
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
            };

            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
                $or: [
                    { cost: { $regex: new RegExp(search, "i") } },
                    { userId: { $regex: new RegExp(search, "i") } },
                ],
            })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" },
        });

        res.status(200).json({
            transactions,
            total,
        });
    } catch (error) {
        console.log("controllers --> getTransactions" + error);
        res.status(404).json({ message: error.message });
    }
};


// This is a JavaScript code that exports an asynchronous function named getTransactions that accepts two parameters req and res.

// The function first destructures the query parameters from the request object. The query parameters include page, pageSize, sort, and search. If any of these parameters are not provided, they will default to 1, 20, null, and an empty string respectively.

// The function then defines a helper function named generateSort that parses the value of the sort parameter and returns an object with a single key-value pair. The key is the value of the field property in the parsed object, and the value is either 1 or -1 depending on whether the value of the sort property is “asc” or “desc”.

// The function then generates a formatted sort object by calling the helper function if the value of the sort parameter is truthy, otherwise it sets it to an empty object.

// The function then queries a MongoDB database using Mongoose’s .find() method to retrieve transactions that match either of two conditions: (1) the value of their cost field matches a regular expression created from the value of the search parameter, or (2) the value of their userId field matches a regular expression created from the value of the search parameter. The results are sorted using the formatted sort object generated earlier, skipped by (page * pageSize) documents, and limited to at most pageSize documents.

// The function then queries the same database again using Mongoose’s .countDocuments() method to retrieve a count of all transactions whose name matches a regular expression created from the value of the search parameter.

// Finally, if all goes well, it sends a JSON response with two properties: an array of transactions matching the search criteria and their total count. If there’s an error, it sends a JSON response with a single property named “message” containing an error message.


export const getGeography = async(req, res) => {
    try {
        const users = await User.find();

        const mappedLocations = users.reduce((acc, { country }) => {
            const countryISO3 = getCountryIso3(country);
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count };
            }
        );

        res.status(200).json(formattedLocations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};