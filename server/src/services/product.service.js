const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAll = async (query) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    page,
    limit,
    sortBy,
    sortOrder,
  } = query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  const where = {};

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [[sortBy || "createdAt", sortOrder || "DESC"]],
    include: Category,
  });

  return {
    rows,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
  };
};

exports.getOne = async (id) => {
  const product = await Product.findByPk(id, { include: Category });
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return product;
};

exports.create = async (data) => {
  if (!(await Category.findByPk(data.categoryId))) {
    const error = new Error("Category not found, product cannot be created");
    error.status = 404;
    throw error;
  }
  const product = await Product.create(data);
  return product;
};

exports.update = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  if (data.categoryId) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
  }
  return await product.update(data);
};

exports.remove = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return await product.destroy();
};
