const { Review, User } = require("../models");

const getByProduct = async (productId) => {
  return Review.findAll({
    where: { productId },
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
    order: [["createdAt", "DESC"]],
  });
};

const create = async (userId, { productId, rating, comment }) => {
  return Review.create({ userId, productId, rating, comment });
};

const remove = async (id) => {
  const review = await Review.findByPk(id);
  if (!review) throw new Error("Review not found");
  await review.destroy();
};

module.exports = { getByProduct, create, remove };
