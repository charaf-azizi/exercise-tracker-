const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    username: String,
   log: [{}]
})
const exerciseModel = new mongoose.model('exerciseModel', exerciseSchema);
module.exports = exerciseModel;