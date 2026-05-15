const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Attempt to send email notification
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: `New Contact Request from ${req.body.name}`,
          text: `You have received a new contact request from the ACM website.\n\nName: ${req.body.name}\nEmail: ${req.body.email}\n\nMessage:\n${req.body.message}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact notification email sent successfully.');
      } else {
        console.log('Email credentials not found in .env, skipping email notification.');
      }
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // We don't fail the request if the email fails, the message is still saved in DB.
    }

    res.status(201).json({ success: true, data: contact, message: 'Message received! An email has been sent to the admin.' });
  } catch (error) { next(error); }
};
