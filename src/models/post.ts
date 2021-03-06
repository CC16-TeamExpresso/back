import mongoose, { Schema } from 'mongoose';
import Message from "./messages";

const PostModel = new mongoose.Schema(
  {
    email: { type: String, required: true }, //identifier
    uri: { type: String, required: true},
    like: {type: Number, required: false, default: 0},
    messages: [{type: Schema.Types.ObjectId, ref: Message, required: false}]
  },
  { collection: 'posts' }
)

const model = mongoose.model('PostModel', PostModel);

export default model;