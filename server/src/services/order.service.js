const { Order, OrderItem, Product, User } = require("../models");
const { Op, Transaction } = require("sequelize");
const { sequelize } = require("../models");

exports.create = async (userId, items) => {
  if (items.length === 0) {
    const error = new Error("Products not added");
    error.status = 404;
    throw error;
  }

  const result = await sequelize.transaction(async (transaction) => {
    let total = 0;
    const products = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!product) {
        const error = new Error("Products not found");
        error.status = 404;
        throw error;
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}"`);
      }

      await product.decrement("stockQuantity", {
        by: item.quantity,
        transaction,
      });

      total += product.price * item.quantity;
      products.push(product);
    }

    const order = await Order.create(
      { userId, totalAmount: total, status: "PENDING" },
      { transaction },
    );

    const orderItems = await OrderItem.bulkCreate(
      items.map((item, index) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: products[index].price,
      })),
      { transaction },
    );

    return order;
  });
  return result;
};

exports.getMyOrders = async (userId, query) => {
  const { search, page, limit, sortBy, order } = query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  const where = {};
  where.userId = userId;

  const { count, rows } = await Order.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [[sortBy || "createdAt", order || "DESC"]],
    include: [
      { model: User, attributes: { exclude: ["password"] } },
      { model: OrderItem, include: [{ model: Product }] },
    ],
  });

  return {
    rows,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
  };
};

exports.getMyOrder = async (userId, id) => {
  const order = await Order.findOne({
    where: { id, userId },
    include: [{ model: OrderItem, include: [{ model: Product }] }],
  });

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
};

exports.getAll = async (query) => {
  const { search, page, limit, sortBy, order } = query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  const where = {};

  const { count, rows } = await Order.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [[sortBy || "createdAt", order || "DESC"]],
    include: [
      { model: User, attributes: { exclude: ["password"] } },
      { model: OrderItem, include: [{ model: Product }] },
    ],
  });

  return {
    rows,
    count,
    totalPages: Math.ceil(count / limitNum),
    currentPage: pageNum,
  };
};

exports.getOne = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      { model: User, attributes: { exclude: ["password"] } },
      { model: OrderItem, include: [{ model: Product }] },
    ],
  });
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  return order;
};

exports.cancel = async (orderId, userId = null) => {
  const result = await sequelize.transaction(async (transaction) => {
    const where = { id: orderId };
    if (userId) where.userId = userId;

    const order = await Order.findOne({
      where,
      include: [{ model: OrderItem }],
      transaction,
    });

    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    if (order.status !== "PENDING") {
      const error = new Error("Only PENDING orders can be canceled");
      error.status = 400;
      throw error;
    }

    for (const item of order.OrderItems) {
      await Product.increment("stockQuantity", {
        by: item.quantity,
        where: { id: item.productId },
        transaction,
      });
    }

    await order.update({ status: "CANCELED" }, { transaction });
    return order;
  });
  return result;
};

exports.updateStatus = async (id, status) => {
  const order = await Order.findByPk(id);
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  const validStatuses = ["PENDING", "PAID", "CANCELED"];
  if (!validStatuses.includes(status)) {
    const error = new Error("Invalid order status");
    error.status = 400;
    throw error;
  }

  return await order.update({ status });
};
