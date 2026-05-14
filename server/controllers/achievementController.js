const Model = require('../models/Achievement');
exports.getAll = async (req, res, next) => {
  try {
    const data = await Model.find(req.query);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
exports.getOne = async (req, res, next) => {
  try {
    const data = await Model.findOne({ slug: req.params.slug });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
exports.create = async (req, res, next) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};
exports.update = async (req, res, next) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
exports.delete = async (req, res, next) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (error) { next(error); }
};
