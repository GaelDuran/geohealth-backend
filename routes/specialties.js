const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');

// Obtener todas las especialidades
router.get('/', async (req, res) => {
    try {
        const specialties = await Specialty.find();
        res.json(specialties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear especialidad
router.post('/', async (req, res) => {
    try {
        const specialty = new Specialty({
            name: req.body.name,
            description: req.body.description
        });

        const newSpecialty = await specialty.save();
        res.status(201).json(newSpecialty);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar especialidad
router.patch('/:id', async (req, res) => {
    try {
        const specialty = await Specialty.findById(req.params.id);

        if (!specialty) {
            return res.status(404).json({
                message: 'Especialidad no encontrada'
            });
        }

        specialty.name = req.body.name || specialty.name;
        specialty.description =
            req.body.description || specialty.description;

        const updated = await specialty.save();

        res.json(updated);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar especialidad
router.delete('/:id', async (req, res) => {
    try {

        const specialty = await Specialty.findById(req.params.id);

        if (!specialty) {
            return res.status(404).json({
                message: 'Especialidad no encontrada'
            });
        }

        await Specialty.deleteOne({
            _id: req.params.id
        });

        res.json({
            message: 'Especialidad eliminada'
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;