const mongoose = require('mongoose');

const MedicalStaffSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty',
        required: true
    }

});

module.exports = mongoose.model(
    'MedicalStaff',
    MedicalStaffSchema
);