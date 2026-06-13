const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const books = require('./routes/books');
const places = require('./routes/places');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/users');
const specialties = require('./routes/specialties');
const medicalStaff = require('./routes/medicalStaff');
const zones = require('./routes/zone');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/books', books);
app.use('/api/places', places);
app.use('/api/users', users);
app.use('/api/specialties', specialties);
app.use('/api/medicalStaff', medicalStaff);
app.use('/api/zones', zones);
app.use(errorMiddleware);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión exitosa!'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

app.get('/', (req, res) => {
    res.json({
        message: 'GeoHealth API funcionando correctamente'
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});