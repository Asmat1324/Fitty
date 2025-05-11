// backend/user.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: ''},
    date_created: { type: Date, default: Date.now },
    conversations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
      }]
});

const User = mongoose.model('User', UserSchema);

export default User;