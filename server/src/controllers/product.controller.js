const productService = require("../services/product.service");

exports.getAll = async (req, res) => {
  const result = await productService.getAll(req.query);
  return res
    .status(200)
    .json({ message: "Successfully retrieved products", result });
};

exports.getOne = async (req, res) => {
  const result = await productService.getOne(req.params.id);
  return res
    .status(200)
    .json({ message: "Successfully found the product", result });
};

exports.create = async (req, res) => {
  const result = await productService.create(req.body);
  return res
    .status(201)
    .json({ message: "Successfully created a product", result });
};

exports.update = async (req, res) => {
  const result = await productService.update(req.params.id, req.body);
  return res
    .status(200)
    .json({ message: "Successfully updated a product", result });
};

exports.remove = async (req, res) => {
  await productService.remove(req.params.id);
  return res.status(204).send();
};
