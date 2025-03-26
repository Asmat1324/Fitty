import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;