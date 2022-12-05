const router = require('express').Router();
const ItineraryManager = require('../db_managers/ItineraryManager');

router.use((err, req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.send({
            statusCode: 403,
        });
    }
});

router.post('/namestartsWith', async (req, res) => {
    const starting = req.body.starting;
    try {
        const itineraries = await ItineraryManager.getItineraryNameStartingWith(starting);
        res.send({
            statusCode: 200,
            itineraries: itineraries, 
        });
    } catch (error) {
        res.send({
            statusCode: 500,
            itineraries: [],
        });
    }
});

router.get('/byLocation', async (req, res) => {
    const placeId = req.query.placeId;
    if (!placeId) {
        console.log('No location id included in the request body');
        res.send({
            itineraries: [],
        });
    }
    try {
        const itineraries = await ItineraryManager.getItinerariesByPlaceId(placeId);
        res.send({
            itineraries: itineraries,
        });
    } catch (error) {
        res.send({
            itineraries: [],
        })
    }
});

module.exports = router;