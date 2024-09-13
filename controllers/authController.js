const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');

exports.creatUser = handlerFactory.createOne();
