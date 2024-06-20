import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";

export const checkProductData = async (req = request, res = response, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    const products = await productDao.getAll();

    // se valida que no se repita el campo de code
    const productExists = products.docs.find((p) => p.code === code);
    if (productExists) return res.status(400).json({ status: "Error", msg: `El producto con el código ${code} ya existe` });

    // Validamos que los campos sean obligatorios
    const checkData = Object.values(newProduct).includes(undefined);
    if (checkData) return res.status(400).json({ status: "Error", msg: "Todos los datos son obligatorios" });

    // Validamos que los campos numéricos sean números y mayores o iguales a 0
    if (typeof price !== 'number' || price < 0 || typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ status: "Error", msg: "El precio y el stock deben ser números mayores o iguales a 0" });
    }

    // Validamos que los campos de texto sean cadenas de texto y no estén vacías

    if (typeof title !== 'string' || title.trim() === '' || typeof description !== 'string' || description.trim() === '' || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ status: "Error", msg: "El título, la descripción y la categoría deben ser cadenas de texto no vacías" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
};
