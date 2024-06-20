import { request, response } from "express";
import { cartModel } from "../dao/mongoDB/models/cart.model.js";

export const validateCartExists = async (req = request, res = response, next) => {
    try {
        const { cid } = req.params; // get cart id from request parameters

        const cart = await cartModel.findById(cid); // find cart by id
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
        }

        req.cart = cart; // add cart to request object
        next();
    } catch (error) {
        next(error);
    }
};