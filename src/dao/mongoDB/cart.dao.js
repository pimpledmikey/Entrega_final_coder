import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";

const getAll = async () => {
  const carts = await cartModel.find();
  return carts;
};

const getById = async (id) => {
  const cart = await cartModel.findById(id).populate("products.product");
  return cart;
};

//cfrear carrito
const create = async () => {
  const cart = await cartModel.create({});

  return cart;
};


//actualizar carrito
const update = async (id, data) => {
  const cartUpdate = await cartModel.findByIdAndUpdate(id, data, { new: true });
  return cartUpdate;
};


//eliminar carrito
const deleteOne = async (id) => {
  const cart = await cartModel.deleteOne({ _id: id });
  return cart;
};


//aregar producto al carrito
const addProductToCart = async (cid, pid) => {
  const cart = await cartModel.findById(cid);

  const productInCart = cart.products.find((element) => element.product == pid);
  if (productInCart) {
    productInCart.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save(); // Guardamos los cambios realizado en la base de datos de mongo
  return cart;
};




//eliminar producto del carrito

const deleteProductFromCart = async (cid, pid) => {
  /*const cart = await cartModel.findById(cid);
  const productInCart = cart.products.find((element) => element.product == pid);
  if (productInCart) {
    productInCart.quantity--;
    if (productInCart.quantity === 0) {
      cart.products = cart.products.filter((element) => element.product != pid);
    }
    await cart.save();
  }
  return cart;


   */
  const cart = await cartModel.findById(cid);
  cart.products = cart.products.filter((element) => element.product != pid);
    await cart.save();

    return cart;



};

//actualizar cantidad de producto en el carrito


const updateProductQuantity = async (cid, pid, quantity) => {

  const cart = await cartModel.findById(cid);

  const productInCart = cart.products.find((element) => element.product == pid);
  if (productInCart) {
    productInCart.quantity = quantity;
    await cart.save();
  }
  return cart;
};

//limpiar productos del carrito

const clearProductsToCart = async (cid) => {
  const cart = await cartModel.findById(cid);
  cart.products = [];
  await cart.save();
  return cart;
};


export default {
  getAll,
  getById,
  create,
  update,
  deleteOne,
  addProductToCart,
  deleteProductFromCart,
  updateProductQuantity,
    clearProductsToCart
};
