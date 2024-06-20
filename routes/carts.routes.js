import { Router } from "express";
import cartDao from "../dao/mongoDB/cart.dao.js";
import productDao from "../dao/mongoDB/product.dao.js";
import { validateCartExists } from "../middlewares/validateCartExists.middleware.js";
import { validateProductExists } from "../middlewares/validateProductExists.middleware.js";


const router = Router();
// creamos un carrito


router.post("/", async (req, res) => {
  try {
    const cart = await cartDao.create();

    res.status(201).json({ status: "success", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});

//obtenemos un carrito por id
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartDao.getById(cid);

    res.status(200).json({ status: "success", cart });
  } catch (error) {

    console.log(error);

    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }

});

//agregamos un producto al carrito

router.post("/:cid/product/:pid", validateCartExists, validateProductExists, async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.addProductToCart(cid, pid);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: error.message });
  }
});

//eliminamos un producto del carrito

router.delete("/:cid/product/:pid", validateCartExists, validateProductExists, async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.deleteProductFromCart(cid,  pid);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: error.message });
  }
});

//

router.put("/:cid/product/:pid", validateCartExists, validateProductExists, async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const product = await productDao.getById(pid);

    // Verificar si la cantidad es mayor al stock del producto
    if (quantity > product.stock) {
      return res.status(400).json({ status: "Error", msg: "La cantidad solicitada supera el stock disponible" });
    }

    const cart = await cartDao.getById(cid);
    const cartUpdate = await cartDao.updateProductQuantity(cid, pid, quantity);
    res.status(200).json({ status: "success", payload: cartUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: error.message });
  }
});

//eliminamos un carrito prodcutos

router.delete("/:cid",validateCartExists, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.clearProductsToCart(cid);
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: error.message });
  }
});

export default router;
