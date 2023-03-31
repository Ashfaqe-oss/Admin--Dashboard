import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";


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