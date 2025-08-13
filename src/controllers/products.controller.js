import { getPaginated } from '../services/products.service.js';

export async function getAll(req, res, next) {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await getPaginated({
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      sort,
      query
    });

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (p) => p ? `${baseUrl}?page=${p}&limit=${limit || 10}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.hasPrevPage ? result.prevPage : null),
      nextLink: buildLink(result.hasNextPage ? result.nextPage : null)
    });
  } catch (err) {
    next(err);
  }
}
