import mongoose from 'mongoose';
const schema = mongoose.Schema({
  tuit: String,
  username: String,
  handle: String,
  image: String,
  time: String,
  likes: Number,
  liked: Boolean,
}, {collection: 'tuits'});
export default schema;