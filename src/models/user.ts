import mongoose from 'mongoose';

const UserModel = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true }, //I didnt use unique here because two people can have the same password
		username: {type: String, required: true},
		lat: {type: Number, required: false},
		lng: {type: Number, required: false}
	},
	{ collection: 'users' }
);

const model = mongoose.model('UserModel', UserModel);

export default model;
