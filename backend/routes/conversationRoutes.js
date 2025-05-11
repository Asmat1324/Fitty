import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

//configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//configure multer for temp file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer ({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

/**
 * @route GET /api/conversations
 * @desc Get all conversations for a user
 * @access Private
 */
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id  
        })
        .populate('participants', 'username firstname lastname')
        .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @route POST /api/conversations
 * @desc Create a new conversation
 * @access Private
 */
router.post('/conversations', auth, async (req, res) => {
    try {
        const { participants, type, name } = req.body;

        //validate participants
        if (!participants || !Array.isArray(participants)) {
            return res.status(400).json({ message: 'Participants are required' });
        }

        //Ensure current user is included in participants
        if (!participants.includes(req.user.id)) {
            return res.status(400).json({ message: 'Current user must be a participant' });
        }

        //For direct messages, only 2 participants are allowed
        if (type === 'direct' && participants.length !== 2) {
            return res.status(400).json({ message: 'Direct messages must have exactly 2 participants' });
        }

        //For group chats, a name is required
        if (type === 'group' && !name) {
            return res.status(400).json({ message: 'Group chats must have a name' });
        }

        //check if a direct conversation already exists between these two users
        if (type === 'direct') {
            const existingConversation = await Conversation.findOne({
                type: 'direct',
                participants: { $all: participants, $size: 2 }
            });

            if (existingConversation) {
                return res.status(200).json(existingConversation);
            }
        }

        //Create a new converation
        const newConversation = new Conversation({
            participants,
            type,
            name: type === 'group' ? name : null
        });

        const savedConversation = await newConversation.save();

        //Add the conversation to all participants' user docuements
        await User.updateMany(
            { _id: { $in: participants } },
            { $push: { conversations: savedConversation._id } }
        );

        //Populate participants
        const populatedConversation = await Conversation.findById(savedConversation._id)
            .populate('participants', 'username firstname lastname');

            res.status(201).json(populatedConversation);
    } catch (err) {
        console.error('Error creating conversation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route GET /api/conversations/:id
 * @desc Get a specific conversation
 * @access Private
 */
router.get('/conversations/:id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('participants', 'username firstname lastname');

            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }

            //Check if the requesting user is a participant
            if (!conversation.participants.some(p => p._id.toString() === req.user.id)) {
                return res.status(403).json({ message: 'Not authorized to access this conversation' });
            }

            res.status(200).json(conversation);
    } catch (err) {
        console.error('Error fetching conversation:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route PUT /api/conversations/:id
 * @desc Update a conversation (for groups)
 * @access Private
 */
router.put('/conversations/:id', auth, async (req, res) => {
    try {
        const { name, participants } = req.body;
        const conversation = await Conversation.findById(req.params.id);
    
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
    
        //Check if the requesting user is a participant
        if (!conversation.participants.some(p => p.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this conversation' });
        }
    
        //Update fields
        if (name) conversation.name = name;
        if (participants) {
            //Ensure the current user remains in participants
            if (!participants.includes(req.user.id)) {
                participants.push(req.user.id);
            }
            conversation.participants = participants;
        }
    
        conversation.updatedAt = Date.now();
        const updatedConversation = await conversation.save();
    
        //If participants were updated, update the users' conversation arrays
        if (participants) {
            //remove conversation from users no longer in the group
            await User.updateMany(
                {
                    _id: { $nin: participants },
                    conversations: req.params.id
                },
                { $pull: { conversations: req.params.id } }
            );
    
            //add conversation to new users
            await User.updateMany(
                {
                    _id: { $in: participants },
                    conversations: { $ne: req.params.id }
                },
                { $push: { conversations: req.params.id } }
            );
        }
    
        const populatedConversation = await Conversation.findById(updatedConversation._id)
            .populate('participants', 'username firstname lastname');
    
        res.status(200).json(populatedConversation);
    } catch (err) {
        console.error('Error updating conversation:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route DELETE /api/conversations/:id
 * @desc Delete a conversation
 * @access Private
 */
router.delete('/conversations/:id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        //Check if the requesting user is a participant
        if (!conversation.participants.some(p => p.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to delete this conversation' });
        }

        //For group chats maybe add logic to only allow deletion by admin

        //Delete all messages in the conversation
        await Message.deleteMany({ conversation: req.params.id });

        //Remove the conversation from all participants' user documents
        await User.updateMany(
            { conversations: req.params.id },
            { $pull: { conversations: req.params.id } }
        );

        //Delete the conversation
        await conversation.deleteOne();

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (err) {
        console.error('Error deleting conversation:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @router GET /api/conversations/:id/messages
 * @desc Get all messages in a conversation
 * @access Private
 */
router.get('/conversations/:id/messages', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        //Check if the requesting user is a participant
        if (!conversation.participants.some(p => p.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this conversation' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ conversationId: req.params.id })
            .populate('sender', 'username firstname lastname')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route POST /api/conversations/:id/messages
 * @desc Send a message in a conversation
 * @access Private
 */
router.post('/conversations/:id/messages', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        //Check if the requesting user is a participant
        if (!conversation.participants.some(p => p.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
        }

        const newMessage = new Message({
            conversationId,
            sender: req.user._id,
            content,
            readBy: [req.user.id]
        });

        const savedMessage = await newMessage.save();

        //Update the conversation's last message and timestamp
        conversation.lastMessage = {
            sender: req.user._id,
            content,
            timestamp: savedMessage.timestamp
        };
        conversation.updatedAt = savedMessage.timestamp;
        await conversation.save();

        //populate the message with sender information
        const populatedMessage = await Message.findById(savedMessage._id)
            .populate('sender', 'username firstname lastname');

        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error('Error sending message:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route POST /api/upload
 * @desc Upload an image to S3
 * @access Private
 */
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

    //read the file
    const fileContent = fs.readFileSync(req.file.path);

    //Set up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `messages/${Date.now()}-${req.file.originalname}`,
        Body: fileContent,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
    };

    //Upload to S3
    s3.upload(params, async (err, data) => {
        //delete the temp file
        fs.unlinkSync(req.file.path);

        if (err) {
            console.error('S3 upload error:', err);
            return res.status(500).json({ message: 'Failed to upload to S3' });
        }

        //return the s3 url
        res.status(200).json({ url: data.Location });
    });
} catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Server error' });
}
});

/**
 * @route PUT /api/messages/:id/read
 * @desc Mark a message as read
 * @access Private
 */
router.put('/messages/:id/read', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        //Check if user is in the conversation
        const conversation = await Conversation.findById(message.conversationId);
        if (!conversation.participants.some(p => p.toString() === req.userid)) {
            return res.status(403).json({ message: 'Not authorized to access this message' });
        }

        //add user to readBy if not already there
        if (!message.readBy.includes(req.user.id)) {
            message.readBy.push(req.user.id);
            await message.save();
        }

        res.status(200).json({ message: 'Message marked as read' });
    } catch (err) {
        console.error('Error marking message as read:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route DELETE /api/messages/:id
 * @desc Delete a message
 * @access Private
 */
router.delete('/messages/:id', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        //COnly the sender can delete their message
        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        //if this is the last message in the conversation, update the conversation
        const conversation = await Conversation.findById(message.conversationId);
        if (conversation.lastMessage && 
            conversation.lastMessage.sender.toString() === req.user.id &&
            new Date(conversation.lastMessage.timestamp).getTime() === new Date(message.timestamp).getTime()) {

                //Find the new last message
                const newLastMessage = await MessageChannel.findOne({
                    conversationId: message.conversationId,
                    _id: { $ne: message._id }
                }).sort({ timestamp: -1 });

                if (newLastMessage) {
                    conversation.lastMessage = {
                        sender: newLastMessage.sender,
                        content: newLastMessage.content,
                        timestamp: newLastMessage.timestamp
                    };
                } else {
                    conversation.lastMessage = null;
                }

            await conversation.save();
        }

        //delete message
        if (message.media) {
            //extract key from s3 url
            const key = message.media.split('/').slice(3).join('/');

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key
            };

            //Delete from S3
            s3.deleteObject(params, (err, data) => {
                if (err) console.error('S3 delete error:', err);
            });
        }

        await message.deleteOne();

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error('Error deleting message:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private
 */
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find()
            .select('username firstname lastname profilePicture')
            .sort({ username: 1 });

        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;