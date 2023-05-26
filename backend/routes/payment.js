const express = require("express");
const axios = require("axios");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const price_id = process.env.PRICE_ID;
const payrouter = express.Router();

payrouter.post("/subscript", async (req, res) => {
  // Token is created using Stripe Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express
  const email = req.body.email;
  // Create a Customer:
  await stripe.customers
    .create({
      source: token,
      email: email
    })
    .then(async (customer) => {
      // Use the customer for further processing (e.g., create subscription)
      const subscription = await stripe.subscriptions
        .create({
          customer: customer.id,
          items: [{ plan: price_id }]
        })
        .then((subscription) => {
          // Handle success
          res.status(201).send({
            result: subscription
          });
        })
        .catch((error) => {
          // Handle error
          res.status(404).send({
            result: error
          });
        });
    })
    .catch((error) => {
      // Handle error
      res.status(404).send({
        result: error
      });
    });
});

payrouter.post("/cancel", async (req, res) => {
  const SUBSCRIPTION_ID = req.body.SUBSCRIPTION_ID;
  stripe.subscriptions
    .cancel(SUBSCRIPTION_ID)
    .then((cancelledSubscription) => {
      // Handle success
      res.status(201).send({
        result: cancelledSubscription.status
      });
    })
    .catch((error) => {
      // Handle error
      res.status(404).send({
        result: error
      });
    });
});

payrouter.post("/confirm", async (req, res) => {
  const SUBSCRIPTION_ID = req.body.SUBSCRIPTION_ID;

  stripe.subscriptions.retrieve(SUBSCRIPTION_ID, function (err, subscription) {
    if (err) {
      res.status(404).send({
        result: err
      });
    }

    // Get the latest invoice ID associated with the subscription
    const latestInvoiceId = subscription.latest_invoice;

    // Retrieve the invoice object
    stripe.invoices.retrieve(latestInvoiceId, function (err, invoice) {
      if (err) {
        res.status(404).send({
          result: err
        });
      }

      // Get the payment intent ID associated with the invoice
      const paymentIntentId = invoice.payment_intent;

      // Retrieve the payment intent object
      stripe.paymentIntents.retrieve(
        paymentIntentId,
        function (err, paymentIntent) {
          if (err) {
            res.status(404).send({
              result: err
            });
            return;
          }
          res.status(201).send({
            result: paymentIntent.status
          });
          console.log("Payment Intent:", paymentIntent);
        }
      );
    });
  });
});

module.exports = payrouter;
