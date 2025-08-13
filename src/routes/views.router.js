import { Router } from "express";
import productModel from "../models/product.model.js";
import productManager from "../models/productManager.js";

const router = Router();

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  let filter = {};
  if (query) {
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else {
      filter.category = query;
    }
  }

  let sortOption = {};
  if (sort) {
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption,
    lean: true
  };

  const result = await productModel.paginate(filter, options);

  res.render("products", {
    products: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
      : null,
    nextLink: result.hasNextPage
      ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
      : null
  });
});

// Ruta Home
router.get('/', async (req, res) =>{
  const result = await productModel.paginate({}, { page: 1, limit: 10, lean: true });
  res.render('home', { products: result.docs });

//  const products = productManager.getProducts();
  //res.render('home', { products });
});

// Ruta Real Time Products
router.get('/realtimeproducts', async (req, res) =>{
  const result = await productModel.paginate(
    {},
    {
      page: 1,
      limit: 1000,
      sort: { price: 1 }, // ascendente por precio
      lean: true
    }
  );
  res.render('realTimeProducts', { products: result.docs });
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate("products.product");

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", {
      cartId: cid,
      products: cart.products,
      helpers: {
        multiply: (a, b) => a * b
      }
    });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
});

export default router;
