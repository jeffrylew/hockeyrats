const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Define Dynamic Transactional Template data for email to customer
 * @param {Object} body - Body of request to post route
 * @param {number} order_id - ID of reservation request
 */
const confirmationEmail = (body, order_id) => {
  const { items, cartName, cartEmail, cartPhone, cartMsg } = body;

  return {
    to: [
      {
        name: cartName,
        email: cartEmail
      },
    ],
    from: 'support@hockeyrats.com',
    templateId: process.env.SENDGRID_RESERVATION_TEMPLATE_ID,
    dynamicTemplateData: {
      order_id: order_id,
      items: items,
      cartName: cartName,
      cartEmail: cartEmail,
      cartPhone: cartPhone,
      cartMsg: cartMsg,
      receipt: true
    }
  };

} // const confirmationEmail = ...

/**
 * Define Dynamic Transactional Template data for email to Coach Joe
 * @param {Object} body - Body of request to post route
 * @param {number} order_id - ID of reservation request
 */
const requestEmailJoe = (body, order_id) => {
  const { items, cartName, cartEmail, cartPhone, cartMsg } = body;

  return {
    to: [
      {
        name: 'Joe Wagner',
        email: 'jeffryklew@gmail.com'
      },
    ],
    from: 'support@hockeyrats.com',
    templateId: process.env.SENDGRID_RESERVATION_JOE_TEMPLATE_ID,
    dynamicTemplateData: {
      order_id: order_id,
      items: items,
      cartName: cartName,
      cartEmail: cartEmail,
      cartPhone: cartPhone,
      cartMsg: cartMsg,
      receipt: true
    }
  };

} // const requestEmailJoe = ...


/* Prevent GET reserve route from being accessed directly */
router.get('/', (req, res) => {
  res.redirect(403, process.env.DOMAIN);
});


/* Send reservation request emails */
router.post('/', (req, res) => {
  // Get unixtime through date-fns
  const getUnixTime = require('date-fns/getUnixTime');
  const unixtime    = getUnixTime(new Date());

  // Send confirmation emails to customer and Coach Joe
  sgMail
    .send(confirmationEmail(req.body, unixtime))
    .then(() => sgMail.send(requestEmailJoe(req.body, unixtime)))
    .then(() => res.status(200).send({
      successURL: process.env.DOMAIN + '/reserve/success?order_id=' + unixtime
    }))
    .catch(error => {
      res.sendStatus(500);
    });
});


/* GET success page */
router.get('/success', (req, res) => {
  // Get order_id query value
  const { order_id } = req.query;

  if (order_id === undefined || order_id === "") {
    res.redirect(404, process.env.DOMAIN);
  } else {
    res.render('reservation_success', {
      order_id: order_id
    });
  }
});

module.exports = router;