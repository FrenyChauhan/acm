const express = require('express');
const router = express.Router();
const { getAllEvents, getEventBySlug, createEvent, updateEvent, deleteEvent, seedEvents } = require('../controllers/eventController');

router.post('/seed', seedEvents);
router.get('/flagship', (req, res, next) => { req.query.flagship = 'true'; next(); }, getAllEvents);
router.route('/').get(getAllEvents).post(createEvent);
router.route('/:slug').get(getEventBySlug);
router.route('/:id').put(updateEvent).delete(deleteEvent);
module.exports = router;
