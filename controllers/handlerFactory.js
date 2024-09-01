const catchAsync = require('express-async-handler');
const ApiFeatures = require('./../utils/ApiFeatures');
const slugify = require('slugify');
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      // send error
      res.status(404).json({
        status: 'fail',
        message: 'Id not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      page: req.query.page * 1 || 1,
      data: {
        data: docs,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      // send error
      res.status(404).json({
        status: 'fail',
        message: 'Id not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      // send error
      res.status(404).json({
        status: 'fail',
        message: 'Id not found.',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
