import Cart from '../models/Cart.model.js';

export const createCart = () => Cart.create({ products: [] });

export const getCartById = (cid) =>
  Cart.findById(cid).populate('products.product').lean();

export const addProductToCart = async (cid, pid, quantity = 1) => {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error('Cart not found');

  const found = cart.products.find(p => p.product.toString() === pid);
  if (found) {
    found.quantity += quantity;
  } else {
    cart.products.push({ product: pid, quantity });
  }
  await cart.save();
  return cart.populate('products.product');
};

export const updateCart = async (cid, products) => {
  // products = [{ product: productId, quantity }]
  const cart = await Cart.findByIdAndUpdate(
    cid,
    { products },
    { new: true }
  ).populate('products.product');
  if (!cart) throw new Error('Cart not found');
  return cart;
};

export const updateProductQuantity = async (cid, pid, quantity) => {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error('Cart not found');

  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) throw new Error('Product not in cart');

  item.quantity = quantity;
  await cart.save();
  return cart.populate('products.product');
};

export const deleteProductFromCart = async (cid, pid) => {
  const cart = await Cart.findByIdAndUpdate(
    cid,
    { $pull: { products: { product: pid } } },
    { new: true }
  ).populate('products.product');
  if (!cart) throw new Error('Cart not found');
  return cart;
};

export const clearCart = async (cid) => {
  const cart = await Cart.findByIdAndUpdate(
    cid,
    { products: [] },
    { new: true }
  ).populate('products.product');
  if (!cart) throw new Error('Cart not found');
  return cart;
};
