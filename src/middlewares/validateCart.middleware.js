import { request, response } from "express";
import { cartModel } from "../models/cart.model.js"; // Importa el modelo de carrito de Mongoose

export const validateCartExists = async (req = request, res = response, next) => {
    try {
        const { cid } = req.params; // No necesitamos pid aquí

        const cart = await cartModel.findById(cid); // Usa el modelo de carrito para buscar por ID
        if (!cart) {
            return res.status(404).json({ status: "Error", msg: "Carrito no encontrado" });
        }

        req.cart = cart;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "error", message: error.message});
    }
};