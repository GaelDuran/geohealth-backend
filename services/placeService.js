const Place = require('../models/Place');

async function getPlaces() {

    return await Place.find();

}

async function createPlace(data) {

    const place = new Place({

        name: data.name,

        description: data.description,

        location: {
            type: 'Point',
            coordinates: [
                data.longitude,
                data.latitude
            ]
        }

    });

    return await place.save();

}

async function updatePlace(id, data) {

    const place =
        await Place.findById(id);

    if (!place) {

        throw new Error(
            'Place not found'
        );

    }

    place.name =
        data.name || place.name;

    place.description =
        data.description ??
        place.description;

    if (
        data.longitude !== undefined &&
        data.latitude !== undefined
    ) {

        place.location.coordinates = [

            data.longitude,

            data.latitude

        ];

    }

    return await place.save();

}

async function deletePlace(id) {

    const place =
        await Place.findById(id);

    if (!place) {

        throw new Error(
            'Place not found'
        );

    }

    return await Place.deleteOne({
        _id: id
    });

}

module.exports = {

    getPlaces,

    createPlace,

    updatePlace,

    deletePlace

};