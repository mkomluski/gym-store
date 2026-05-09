const reviewService = require("../services/review.service");
const asyncHandler = require("../utils/asyncHandler");

const getByProduct = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getByProduct(req.query.productId);
  res.json({ result: reviews });
});

const create = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user.id, req.body);
  res.status(201).json({ result: review });
});

const remove = asyncHandler(async (req, res) => {
  await reviewService.remove(req.params.id);
  res.json({ result: { message: "Deleted" } });
});

module.exports = { getByProduct, create, remove };
