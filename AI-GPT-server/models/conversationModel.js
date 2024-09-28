const mongoose = require('mongoose');

const conversationModel = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.ObjectId
    },
    chats: [
        {
            type: mongoose.Schema.ObjectId
        }
    ]
}, { timestamps: true })

const Conversation = mongoose.model('Conversations', conversationModel);
module.exports = Conversation;