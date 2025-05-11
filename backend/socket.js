import { Server } from 'socket.io';
import Message from './models/message.js';
import Conversation from './models/conversation.js';
//import User from './models/user.js';

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", //@TODO: adjust for production
            methods: ["GET", "POST"],
        }
    });

    //active sockets map (socketId -> userId)
    const activeSockets = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        //Handle user session
        socket.on('register-socket', (userId) => {
            activeSockets.set(socket.id, userId);
            console.log(`Socket registered for user ${userId}`);
        });

        //Join a conversation 
        socket.on('subscribe-conversations', (conversationIds) => {
            if (Array.isArray(conversationIds)) {
                conversationIds.forEach(id => {
                    socket.join(id);
                    console.log(`Socket ${socket.id} joined conversation ${id}`);
                });
            }
        });

        //Handle new messages
        socket.on('send-message', async (messageData) => {
            try {
                //create new message in database
                const newMessage = new Message({
                    conversationId: messageData.conversationId,
                    sender: messageData.sender,
                    content: messageData.content,
                    media: messageData.media || null,
                    timestamp: new Date(),
                    readBy: [messageData.sender] //initially, the sender has read the message
                });

                const savedMessage = await newMessage.save();

                //Populate sender infor
                const populatedMessage = await Message.findById(savedMessage._id)
                    .populate('sender', 'username firstname lastname');

                    //Update conversation's last message
                    await Conversation.findByIdAndUpdate(
                        messageData.conversationId,
                        {
                            lastMessage: {
                                sender: messageData.sender,
                                content: messageData.content,
                                timestamp: new Date()
                            },
                            updatedAt: new Date()
                        }
                    );
                    
                    //Emit the message to all subscribed clients for this conversation
                    io.to(messageData.conversationid).emit('new-message', populatedMessage);
                } catch (err) {
                    console.error('Error sending message:', err);
                    socket.emit('error', 'Failed to send message');
                }
            });

            //Handle read receipts
            socket.on('mark-read', async ({ messageId, userId }) => {
                try {
                    const message = await Message.findById(messageId);
                    if (message && !message.readBy.includes(userId)) {
                        message.readBy.push(userId);
                        await message.save();

                        //Notify conversation subscribers about read status
                        io.to(message.conversationid).emit('message-read', {
                            messageId,
                            userId
                        });
                    }
                } catch (err) {
                    console.error('Error marking message as read:', err);
                }
            });

            //Handle typing indicator
            socket.on('typing', ({ conversationId, userId }) => {
                socket.to(conversationId).emit('user-typing', userId);
            });

            //Handle stop typing
            socket.on('stop-typing', ({ conversationId, userId }) => {
                socket.to(conversationId).emit('user-stop-typing', userId);
            });

            //Handle user disconnect
            socket.on('disconnect', () => {
                if (activeSockets.has(socket.id)) {
                    const userId = activeSockets.get(socket.id);
                    console.log(`Socket disconnected for user ${userId}`);
                    activeSockets.delete(socket.id);
                }
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    }

    export default setupSocket;