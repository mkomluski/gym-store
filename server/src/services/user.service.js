const { User } = require("../models");
const { Op } = require("sequelize");

const excludePassword = { exclude: ["password"] };

exports.getAll = async (query) => {
  const { search, page, limit, sortBy, order } = query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  const where = {};

  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [[sortBy || "createdAt", order || "DESC"]],
    attributes: excludePassword,
  });

  return {
    rows,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
  };
};

exports.getOne = async (id) => {
  const user = await User.findByPk(id, { attributes: excludePassword });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

exports.update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  delete data.role;
  delete data.password;
  return await user.update(data);
};

exports.remove = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return await user.destroy();
};

exports.getMe = async (id) => {
  const user = await User.findByPk(id, {
    attributes: excludePassword,
  });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

exports.updateMe = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  delete data.role;
  delete data.password;
  return await user.update(data);
};
