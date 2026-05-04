const stripe = require("stripe");

const instance = stripe(process.env.STRIPE_SECRET_KEY);

module.exports = instance;
