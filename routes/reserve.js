const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* Send reservation confirmation emails */
router.post('/', (req, res) => {
  const msg = {
    to: 'jeffryklew@gmail.com',
    from: 'support@hockeyrats.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail
    .send(msg)
    .then(() => {}, error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    });

  res.render('success', {
    session_id: "helloworld"
  });
});

module.exports = router;