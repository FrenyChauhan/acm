const Contact = require('../models/Contact');
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact, message: 'Message received!' });
  } catch (error) { next(error); }
};
