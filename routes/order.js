const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

/* Fetch Checkout Session to display JSON result on success page */
router.get('/', async (req, res) => {
  const { sessionId } = req.query;

  if (sessionId === undefined || sessionId === "")
  {
    res.redirect(403, process.env.DOMAIN);
  }
  else
  {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
  }
});


/* Create Checkout Session with cart items */
router.post('/', async (req, res) => {
  //! Get cart items array and convert to Stripe's line_items
  const { items } = req.body;
  let line_items = [];

  items.forEach(item => {
    line_items.push({
      // TODO: Integrate price ID into cart items
      price: process.env.PVT_LESSON_PRICE,
      quantity: item["qty"],
      description: item["name"]
    });
  });

  //! Domain URL and URL of previous page before redirect to Stripe
  const domainURL = process.env.DOMAIN;
  const prevURL   = req.header('Referer') || domainURL;

  //! Create new Checkout Session for order
  const session = await stripe.checkout.sessions.create({
    payment_method_types: process.env.PAYMENT_METHODS.split(', '),
    mode: 'payment',
    line_items: line_items,
    locale: 'en',
    submit_type: 'pay',
    success_url: `${domainURL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: prevURL
  });

  res.send({
    sessionId: session.id
  });
});


/* GET Stripe public key */
router.get('/config', async (req, res) => {
  const price = await stripe.prices.retrieve(process.env.PVT_LESSON_PRICE);

  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE,
    unitAmount: price.unit_amount,
    currency: price.currency,
  });
});


/* GET success page */
router.get('/success', (req, res) => {
  //! Get session_id query value
  const { session_id } = req.query;

  if (session_id === undefined || session_id === "")
  {
    res.redirect(404, process.env.DOMAIN);
  }
  else
  {
    res.render('success', {
      session_id: session_id
    });
  }
});

module.exports = router;