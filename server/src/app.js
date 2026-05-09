const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");
const categoryRouter = require("./routes/category.routes");
const productRouter = require("./routes/product.routes");
const userRouter = require("./routes/user.routes");
const orderRouter = require("./routes/order.routes");
const stripeRouter = require("./routes/stripe.routes");
const { handleStripeWebhook } = require("./webhooks/stripeWebhook");
const reviewRouter = require("./routes/review.routes");

const app = express();

app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/reviews", reviewRouter);
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
