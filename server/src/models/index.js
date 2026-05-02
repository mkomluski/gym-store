const sequelize = require("../config/database");

const User = require("./User")(sequelize);
const Category = require("./Category")(sequelize);
const Order = require("./Order")(sequelize);
const OrderItem = require("./OrderItem")(sequelize);
const Product = require("./Product")(sequelize);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = { sequelize, User, Category, Product, Order, OrderItem };
