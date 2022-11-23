const router = require('express').Router();
const ItineraryManager = require('../db_managers/ItineraryManager');

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