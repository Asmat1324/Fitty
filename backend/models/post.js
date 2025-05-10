import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    //store link to the image
    imageUri: { type: String, required: true   
    },
    caption: { 
        type: String 
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            text: { type: String, required: true },
             date: {
                type: Date,
                default: Date.now
             }
        }
    ],
    date_created: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model('Post', PostSchema);