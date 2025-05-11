import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null // null for DMs, custom for group chats
    },
    type: {
        type: String,
        enum: ['direct', 'group'],
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastMessage: {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        content: String,
        timestamp: Date
    }
    });

    export default mongoose.model('Conversation', conversationSchema);