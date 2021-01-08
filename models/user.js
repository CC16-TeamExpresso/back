var mongoose_1 = require('mongoose');
var UserModel = new mongoose_1["default"].Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'users' });
var model = mongoose_1["default"].model('UserModel', UserModel);
exports["default"] = model;
