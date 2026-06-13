const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
    try {

        const userExists = await User.findOne({
            email: req.body.email
        });

        if (userExists) {
            return res.status(400).json({
                message: 'El correo ya existe'
            });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        res.status(201).json({
            message: 'Usuario registrado'
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(400).json({
                message: 'Usuario no encontrado'
            });
        }

        if (user.password !== req.body.password) {
            return res.status(400).json({
                message: 'Contraseña incorrecta'
            });
        }

        res.json({

    message: 'Login correcto',

    user: {

        name: user.name,

        email: user.email

    }

});

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;