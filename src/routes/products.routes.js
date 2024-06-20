import { Router } from "express";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import productDao from "../dao/mongoDB/product.dao.js";


const router = Router();
// ryuta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    let { limit, page, sort, category, status,stock,price } = req.query;

    // se agrego la validacion de los query params , mayusculas y minusculas
    sort = sort ? sort.toLowerCase() : sort;
    category = category ? category.toLowerCase() : category;
    status = status ? status.toLowerCase() : status;

    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1
      },
      lean: true,
    };

    // aqui se hace la busqueda por categoria
    if (category) {
      const products = await productDao.getAll({ category }, options);
      return res.status(200).json({ status: "success", products });
    }

    if (status) {
      const products = await productDao.getAll({ status }, options);
      return res.status(200).json({ status: "success", products });
    }

   if (price) {
      const products = await productDao.getAll({ price }, options);
      return res.status(200).json({ status: "success", products });

   }


// se agrego la busqueda por stock
    if (stock) {
      const products = await productDao.getAll({ stock: { $gt: 0 } }, options);
      return res.status(200).json({ status: "success", products });
    }

    const products = await productDao.getAll({}, options);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
});


// ruta para obtener un producto por id

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" });

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});


//ruta para eliminar un producto por id
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productDao.deleteOne(pid);
    if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" });

    res.status(200).json({ status: "success", msg: `El producto con el id ${pid} fue eliminado` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const productData = req.body
    const product = await productDao.update(pid, productData);
    if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" });

    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});

router.post("/", checkProductData, async (req, res) => {
  try {
    const productData = req.body;
    const product = await productDao.create(productData)

    res.status(201).json({ status: "success", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
});
export default router;
