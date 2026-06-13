const express = require('express');
const router = express.Router();

const MedicalStaff = require('../models/MedicalStaff');


// Obtener todos los médicos
router.get('/', async (req, res) => {

    try {

        const doctors = await MedicalStaff
            .find()
            .populate('specialty');

        res.json(doctors);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


// Crear médico
router.post('/', async (req, res) => {

    try {

        const doctor = new MedicalStaff({

            name: req.body.name,

            phone: req.body.phone,

            specialty: req.body.specialty

        });

        const newDoctor = await doctor.save();

        res.status(201).json(newDoctor);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

});


// Actualizar médico
router.patch('/:id', async (req, res) => {

    try {

        const doctor =
            await MedicalStaff.findById(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                message: 'Médico no encontrado'
            });

        }

        doctor.name =
            req.body.name || doctor.name;

        doctor.phone =
            req.body.phone || doctor.phone;

        doctor.specialty =
            req.body.specialty || doctor.specialty;

        const updated =
            await doctor.save();

        res.json(updated);

    } catch (err) {

        res.status(400).json({
            message: err.message
        });

    }

});


// Eliminar médico
router.delete('/:id', async (req, res) => {

    try {

        const doctor =
            await MedicalStaff.findById(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                message: 'Médico no encontrado'
            });

        }

        await MedicalStaff.deleteOne({
            _id: req.params.id
        });

        res.json({
            message: 'Médico eliminado'
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;