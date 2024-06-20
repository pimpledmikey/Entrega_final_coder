import { request, response } from "express";
import { productModel } from "../dao/mongoDB/models/product.model.js";

export const validateProductExists = async (req = request, res = response, next) => {
    try {
        const { pid } = req.params; // get product id from request parameters

        const product = await productModel.findById(pid); // find product by id
        if (!product) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el producto con el id ${pid}` });
        }


        req.product = product; // add product to request object
        next();
    } catch (error) {
        next(error);
    }
};