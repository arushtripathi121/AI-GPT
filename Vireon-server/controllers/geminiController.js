const { getResponse } = require("../helper/geminiApi");
const Chat = require("../models/chatModel");
const Conversation = require("../models/conversationModel");
const UserModel = require("../models/userModel");

// Send Prompt and Get Response + Update/Create Session
exports.response = async (req, res) => {
    try {
        const { prompt, conversationId, email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session expired. Please Login Again',
            });
        }

        const response = await getResponse(prompt);
        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
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

        const fullSession = await Conversation.findById(conversation._id).populate('chats');

        return res.status(200).json({
            success: true,
            data: fullSession,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get All Sessions for a User (with first prompt in each session)
exports.getAllConverssationIds = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session expired. Please Login Again',
            });
        }

        const conversations = await Conversation.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'chats',
                select: 'prompt response createdAt',
                options: { sort: { createdAt: 1 } },
            });

        return res.status(200).json({
            success: true,
            data: conversations,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get Full Session by ID (with all chats)
exports.getAllChatsByConversationId = async (req, res) => {
    try {
        const { conversationId } = req.body;

        const conversation = await Conversation.findById(conversationId).populate('chats');
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: conversation,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.body;

        const conversation = await Conversation.findOne({ _id: conversationId });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'No conversation found',
            });
        }

        await Chat.deleteMany({ _id: { $in: conversation.chats } });
        await Conversation.deleteOne({ _id: conversationId });

        return res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
