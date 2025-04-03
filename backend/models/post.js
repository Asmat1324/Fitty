import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    // link the post to the user object from the database
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    //store link to the image
    imageUri: { type: String, required: true },
    caption: { type: String },
   // array of ObjectIds to see which users liked the post
    likes: {type: Number, default: 0},
    comments: {type: Number, default: 0},
    date_created: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;