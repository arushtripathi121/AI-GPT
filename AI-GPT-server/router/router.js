const express = require('express');
const { googleLogin } = require('../controllers/authController');
const router = express.Router();
const { response, getAllConverssationIds, getAllChatsByConversationId, deleteConversation } = require('../controllers/geminiController');

router.get('/google', googleLogin);
router.post('/prompt', response);
router.post('/getConversationIds', getAllConverssationIds);
router.post('/getChats', getAllChatsByConversationId)
router.post('/deleteConversation', deleteConversation)
router.get('/test', (req, res) => {
    res.send('The server is workng fine')
})

module.exports = router;
