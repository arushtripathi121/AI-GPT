const mongoose = require('mongoose');

const chatModel = new mongoose.Schema({ 
    prompt: {
        type: String,
    },
    response: {
        type: String
    }
}, { timestamps: true });

const Chat = mongoose.model('Chats', chatModel);
module.exports = Chat;
