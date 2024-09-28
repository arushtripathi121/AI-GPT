const { oauth2Client } = require("../config/googleConfig");
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');

exports.googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2Client.getToken(code);
        
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);

        const {email, name, picture} = userRes.data;

        let user = await UserModel.findOne({email})

        if(!user) {
            user = await UserModel.create({name, email, image:picture})
        }

        const {_id} = user;
        const token = jwt.sign({_id, email}, process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            token,
            user
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })
    }
}