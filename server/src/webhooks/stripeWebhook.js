const stripe = require("../config/stripe");
const { Order } = require("../models");
const orderService = require("../services/order.service");

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const order = await Order.findOne({
        where: { id: session.metadata.orderId },
      });

      if (order) {
        order.status = "PAID";
        order.stripeSessionId = session.id;
        await order.save();
        console.log(`Order ${order.id} marked as PAID`);
      }
    } catch (err) {
      console.error("Error updating order:", err.message);
      return res.status(500).json({ error: "Failed to update order" });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;

    try {
      await orderService.cancel(session.metadata.orderId);
      console.log(`Order ${session.metadata.orderId} canceled and stock restored (session expired)`);
    } catch (err) {
      if (err.status !== 400) {
        console.error("Error canceling expired order:", err.message);
        return res.status(500).json({ error: "Failed to cancel order" });
      }
    }
  }

  res.json({ received: true });
};

module.exports = { handleStripeWebhook };
