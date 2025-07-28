import fs from 'fs';
import CartManager from '../models/CartManager.js';

const testFile = './tests/carts.test.json';

beforeAll(() => {
  if (!fs.existsSync('./tests')) {
    fs.mkdirSync('./tests');
  }
});
describe('CartManager', () => {
  let manager;

  beforeEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    manager = new CartManager(testFile);
  });

  test('Debe crear un carrito nuevo', () => {
    const cart = manager.addCart();
    expect(cart).toHaveProperty('id');
    expect(cart.products).toEqual([]);
  });

  test('Debe agregar un producto al carrito', () => {
    const cart = manager.addCart();
    const updatedCart = manager.addProductToCart(cart.id, 101, 2);

    expect(updatedCart.products.length).toBe(1);
    expect(updatedCart.products[0]).toEqual({ id: 101, quantity: 2 });
  });

  test('Debe lanzar error si carrito no existe', () => {
    expect(() => manager.getCartById(999)).toThrow('Cart not found');
  });
});