const orderService = require("../services/order.service");

exports.create = async (req, res) => {
  const result = await orderService.create(req.user.id, req.body.items);
  return res
    .status(201)
    .json({ message: "Successfully created your order", result });
};

exports.getMyOrders = async (req, res) => {
  const result = await orderService.getMyOrders(req.user.id, req.query);
  return res
    .status(200)
    .json({ message: "Successfully retrieved your orders", result });
};

exports.getMyOrder = async (req, res) => {
  const result = await orderService.getMyOrder(req.user.id, req.params.id);
  return res
    .status(200)
    .json({ message: "Successfully retrieved your order", result });
};

exports.getAll = async (req, res) => {
  const result = await orderService.getAll(req.query);
  return res
    .status(200)
    .json({ message: "Successfully retrieved orders", result });
};

exports.getOne = async (req, res) => {
  const result = await orderService.getOne(req.params.id);
  return res
    .status(200)
    .json({ message: "Successfully found the order", result });
};

exports.updateStatus = async (req, res) => {
  const result = await orderService.updateStatus(
    req.params.id,
    req.body.status,
  );
  return res
    .status(200)
    .json({ message: "Successfully updated the status", result });
};
