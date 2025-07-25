const mongoose = require('mongoose');

const conversationModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        chats: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Chats',
            },
        ],
    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversations', conversationModel);
module.exports = Conversation;
