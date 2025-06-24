const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

let chatHistory = [];

exports.getResponse = async (userPrompt) => {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    chatHistory.push({ role: "user", content: userPrompt });
    const context = chatHistory.map(entry => `${entry.role}: ${entry.content}`).join("\n");

    const result = await model.generateContent(context);
    const aiResponse = result.response.text();

    chatHistory.push({ role: "assistant", content: aiResponse });
    return aiResponse;
}
