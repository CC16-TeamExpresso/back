import mongoose, { Schema }from 'mongoose';
import User from "./user";

const FollowerModel = new mongoose.Schema(
	{
		followers: [{type: Schema.Types.ObjectId, ref: User, required: false}]
	},
	{ collection: 'followers' }
);

const model = mongoose.model('FollowerModel', FollowerModel);

export default model;