const { getResponse } = require("../helper/geminiApi");
const Chat = require("../models/chatModel");
const Conversation = require("../models/conversationModel");
const UserModel = require("../models/userModel");

exports.response = async (req, res) => {
    try {
        const { prompt, conversationId, email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session expired. Please Login Again'
            });
        }

        const response = await getResponse(prompt);

        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            });
        }

        const chat = await Chat.create({ prompt, response });
        let conversation;

        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        if (conversation) {
            conversation.chats.push(chat._id);
            await conversation.save();
        } else {
            conversation = await Conversation.create({ user: user._id, chats: [chat._id] });
        }

        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


exports.getAllConverssationIds = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session expired. Please Login Again'
            });
        }

        const userId = user._id;

        const conversations = await Conversation.find({ user: userId });

        const firstChats = await Promise.all(conversations.map(async conversation => {
            const firstChat = await Chat.findOne({ _id: { $in: conversation.chats } }).sort({ createdAt: 1 });
            if (firstChat) {
                return {
                    conversationId: conversation._id,
                    firstChat: firstChat.prompt
                };
            }
            return null;
        }));

        return res.status(200).json({
            success: true,
            data: firstChats.filter(chat => chat !== null)
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getAllChatsByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.body;

        const conversation = await Conversation.findById(conversationId).populate('chats');

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        const chatDetails = await Promise.all(conversation.chats.map(async (chatId) => {
            const chat = await Chat.findById(chatId);
            return chat ? { prompt: chat.prompt, response: chat.response } : null;
        }));

        return res.status(200).json({
            success: true,
            data: chatDetails.filter(detail => detail !== null)
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
