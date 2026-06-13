const mongoose = require('mongoose');

const SpecialtySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model(
    'Specialty',
    SpecialtySchema
);