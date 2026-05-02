const { Category } = require("../models");

exports.getAll = async () => {
  return await Category.findAll();
};

exports.getOne = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  return category;
};

exports.create = async (data) => {
  return await Category.create(data);
};

exports.update = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  return await category.update(data);
};

exports.remove = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  return await category.destroy();
};
