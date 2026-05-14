const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, delete: deleteItem } = require('../controllers/achievementController');
router.route('/').get(getAll).post(create);
router.route('/:slug').get(getOne);
router.route('/:id').put(update).delete(deleteItem);
module.exports = router;
