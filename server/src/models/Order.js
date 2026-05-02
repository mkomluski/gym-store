const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "PAID", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      stripeSessionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "orders",
    },
  );

  return Order;
};
