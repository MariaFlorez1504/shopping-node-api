import ProductManager from '../models/ProductManager.js';
import fs from 'fs';
import path from 'path';

const testFilePath = './tests/products.test.json';

beforeAll(() => {
  const dir = path.dirname(testFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(testFilePath, JSON.stringify([])); // limpia antes
});

afterEach(() => {
  fs.writeFileSync(testFilePath, JSON.stringify([])); // limpia después de cada test
});

describe('ProductManager', () => {
  test('Debe agregar un producto correctamente', () => {
    const manager = new ProductManager(testFilePath);
    const product = manager.addProduct({
      title: "Test",
      description: "Test",
      price: 100,
      code: "testcode",
      status: true,
      stock: 5,
      category: "Test",
      thumbnails: []
    });

    expect(product.id).toBeGreaterThan(0);
  });

  test('Debe lanzar error si falta un campo', () => {
    const manager = new ProductManager(testFilePath);
    const product = {
      title: "Test",
      price: 100,
      code: "testcode",
      status: true,
      stock: 5,
      category: "Test",
      thumbnails: []
    };

    expect(() => manager.addProduct(product)).toThrow('Description is required and must be a string.');
  });
});
