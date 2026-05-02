const categoryService = require("../services/category.service");

exports.getAll = async (req, res) => {
  const result = await categoryService.getAll();
  return res
    .status(200)
    .json({ message: "Successfully retrieved categories", result });
};

exports.getOne = async (req, res) => {
  const result = await categoryService.getOne(req.params.id);
  return res
    .status(200)
    .json({ message: "Successfully found the category", result });
};

exports.create = async (req, res) => {
  const result = await categoryService.create(req.body);
  return res
    .status(201)
    .json({ message: "Successfully created a category", result });
};

exports.update = async (req, res) => {
  const result = await categoryService.update(req.params.id, req.body);
  return res
    .status(200)
    .json({ message: "Successfully updated a category", result });
};

exports.remove = async (req, res) => {
  await categoryService.remove(req.params.id);
  return res.status(204).send();
};
