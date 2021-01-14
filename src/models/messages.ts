import mongoose from 'mongoose';

const MessageModel = new mongoose.Schema(
	{
		email: { type: String, required: true }, //identifier
		message: { type: String, required: true },
		date: { type: Number, required: true },
		postId : {type: String, required: false}
	},
	{ collection: 'messages' }
);

const model = mongoose.model('MessageModel', MessageModel);

export default model;
