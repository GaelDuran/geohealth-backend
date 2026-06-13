const express = require('express');
const router = express.Router();

const Zone = require('../models/Zone');


// Obtener zonas
router.get('/', async (req, res) => {

    try {

        const zones =
            await Zone.find();

        res.json(zones);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


// Crear zona
router.post('/', async (req, res) => {

    try {

        const zone = new Zone({

            name:
                req.body.name || 'Zona',

            points:
                req.body.points

        });

        const newZone =
            await zone.save();

        res.status(201)
            .json(newZone);

    } catch (err) {

        res.status(400)
            .json({
                message: err.message
            });

    }

});


// Eliminar zona
router.delete('/:id', async (req, res) => {

    try {

        await Zone.deleteOne({
            _id: req.params.id
        });

        res.json({
            message: 'Zona eliminada'
        });

    } catch (err) {

        res.status(500)
            .json({
                message: err.message
            });

    }

});

module.exports = router;