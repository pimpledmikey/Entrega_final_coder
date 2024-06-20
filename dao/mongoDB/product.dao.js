import { productModel } from "./models/product.model.js";

//obtener todos los productos
const getAll = async (query, option) => {
  const products = await productModel.paginate(query, option );
  return products;
};


//obtener producto por id
const getById = async (id) => {
  const product = await productModel.findById(id);
  return product;
};
//cfrear producto
const create = async (data) => {
  const product = await productModel.create(data);
  return product;
};
//actualizar producto
const update = async (id, data) => {
  const productUpdate = await productModel.findByIdAndUpdate(id, data, { new: true });
  return productUpdate;
};

//eliminar producto
const deleteOne = async (id) => {
  const product = await productModel.findByIdAndUpdate(id, { status: false }, { new: true });
  return product;
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteOne
}