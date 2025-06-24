const mongoose = require('mongoose');
require('dotenv').config();

exports.connectToDb = () => {
    mongoose.connect(process.env.dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log('connected to database'))
    .catch(e => {S
        console.log(e);
    })  
}