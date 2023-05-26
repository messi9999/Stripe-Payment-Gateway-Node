import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
console.log(process.env.REACT_APP_PUBLISHABLE_KEY);

export default function Payment() {
  const [error, setError] = useState("");
  const [stripe, setStripe] = useState(null);
  const [card, setCard] = useState(null);
  const [cardemail, setCardemail] = useState("card@mail.com");

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      const cardElement = stripeInstance.elements().create("card");
      setStripe(stripeInstance);
      setCard(cardElement);
      cardElement.mount("#card-element");

      cardElement.addEventListener("change", (event) => {
        setError(event.error ? event.error.message : "");
      });
    };

    initializeStripe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (stripe && card) {
      const { error, token } = await stripe.createToken(card);

      if (error) {
        setError(error.message);
        alert(error);
      } else {
        stripeTokenHandler(token);
      }
    }
  };

  const stripeTokenHandler = async (token) => {
    // Send the token to your server
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/payment/subscript`,
      {
        stripeToken: token.id,
        email: cardemail
      }
    );
    console.log(res);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} id="payment-form">
        <div className="form-row">
          <label htmlFor="card-element">Credit or debit card</label>
          <div id="card-element">
            {/* A Stripe Element will be inserted here. */}
          </div>

          {/* Used to display form errors. */}
          <div id="card-errors" role="alert">
            {error}
          </div>
        </div>

        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
}
