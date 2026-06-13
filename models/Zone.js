const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({

    name: {
        type: String,
        default: 'Zona'
    },

    points: {
        type: Array,
        required: true
    }

});

module.exports =
    mongoose.model(
        'Zone',
        ZoneSchema
    );