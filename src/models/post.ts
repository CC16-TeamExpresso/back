import mongoose from 'mongoose';

const PostModel = new mongoose.Schema(
  {
    email: { type: String, required: true }, //identifier
    uri: { type: String, required: true}
  },
  { collection: 'posts' }
)

const model = mongoose.model('PostModel', PostModel);

export default model;