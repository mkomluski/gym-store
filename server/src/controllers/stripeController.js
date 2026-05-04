const stripe = require("../config/stripe");
const { Order, OrderItem, Product, User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({
    where: { id: orderId, userId: req.user.id },
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
    ],
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const lineItems = order.OrderItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.Product.name,
      },
      unit_amount: Math.round(item.priceAtPurchase * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: { orderId: order.id.toString() },
  });

  res.json({ url: session.url });
});

module.exports = { createCheckoutSession };
