const express = require('express');
const router = express.Router();

const placeService =
    require('../services/placeService');


// Obtener lugares
router.get('/', async (req, res) => {

    try {

        const places =
            await placeService.getPlaces();

        res.json(places);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


// Crear lugar
router.post('/', async (req, res) => {

    try {

        const place =
            await placeService.createPlace(
                req.body
            );

        res.status(201)
            .json(place);

    } catch (err) {

        res.status(400)
            .json({
                message: err.message
            });

    }

});


// Actualizar lugar
router.patch('/:id', async (req, res) => {

    try {

        const place =
            await placeService.updatePlace(
                req.params.id,
                req.body
            );

        res.json(place);

    } catch (err) {

        res.status(400)
            .json({
                message: err.message
            });

    }

});


// Eliminar lugar
router.delete('/:id', async (req, res) => {

    try {

        await placeService.deletePlace(
            req.params.id
        );

        res.json({
            message:
            'Place deleted'
        });

    } catch (err) {

        res.status(500)
            .json({
                message: err.message
            });

    }

});

module.exports = router;