const express = require('express');
const router = express.Router();

const { googleLogin } = require('../controllers/authController');
const {
    response,
    getAllConverssationIds,
    getAllChatsByConversationId,
    deleteConversation
} = require('../controllers/geminiController');

// Route for Google login
router.get('/google', googleLogin);

// ✅ Matches: POST /conversation/respond
router.post('/conversation/respond', response);

// ✅ Matches: POST /conversation/ids
router.post('/conversation/ids', getAllConverssationIds);

// ✅ Matches: POST /conversation/session
router.post('/conversation/session', getAllChatsByConversationId);

// ✅ Matches: POST /conversation/delete
router.post('/conversation/delete', deleteConversation);

// Test route
router.get('/test', (req, res) => {
    res.send('The server is workng fine');
});

module.exports = router;
