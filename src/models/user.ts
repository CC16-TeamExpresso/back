import mongoose, { Schema } from 'mongoose';
import Post from "./post";
import Follower from "./followers";

const UserModel = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true }, //I didnt use unique here because two people can have the same password
		username: {type: String, required: true},
		lat: {type: Number, required: false},
		lng: {type: Number, required: false},
		posts: [{type: Schema.Types.ObjectId, ref: Post, required: false}],
		followers: {type: Schema.Types.ObjectId, ref: Follower, required: true}
	},
	{ collection: 'users' }
);

const model = mongoose.model('UserModel', UserModel);

export default model;
