import Product from '../models/Product.model.js';

/**
 * listProducts aplica filtros, orden y paginación.
 * options: { page, limit, sort }  // sort: { price: 1 | -1 }
 * filter: { category?, status? }
 */
export const listProducts = async (filter = {}, options = {}) => {
  const defaults = {
    page: 1,
    limit: 10,
    lean: true
  };
  return Product.paginate(filter, { ...defaults, ...options });
};

export const getProductById = (id) => Product.findById(id).lean();

export const createProduct = (data) => Product.create(data);

export const updateProduct = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true, lean: true });

export const deleteProduct = (id) => Product.findByIdAndDelete(id).lean();
