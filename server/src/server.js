const app = require("./app");
const sequelize = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

start();
