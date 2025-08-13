import * as svc from '../services/carts.service.js';

export async function removeProduct(req, res, next) {
  try {
    const cart = await svc.deleteProduct(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (e) { next(e); }
}

export async function updateAll(req, res, next) {
  try {
    const cart = await svc.updateProducts(req.params.cid, req.body.products);
    res.json(cart);
  } catch (e) { next(e); }
}

export async function updateQuantity(req, res, next) {
  try {
    const cart = await svc.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(cart);
  } catch (e) { next(e); }
}

export async function clear(req, res, next) {
  try {
    const cart = await svc.clearCart(req.params.cid);
    res.json(cart);
  } catch (e) { next(e); }
}
