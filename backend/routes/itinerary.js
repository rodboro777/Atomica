const router = require('express').Router();
const ItineraryManager = require('../db_managers/ItineraryManager');
const Itinerary = require('../entities/Itinerary');

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
    } catch (err) {
        console.log(err);
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
    } catch (err) {
        console.log(err);
        res.send({
            itineraries: [],
        })
    }
});

router.get('/byUser', async (req, res) => {
    const userId = req.session.user._id;
    if (!userId) {
        console.log('No user id provided');
        res.send({
            itineraries: [],
        });
    }

    try {
        const itineraries = await ItineraryManager.getItinerariesByUser(userId);
        res.send({
            itineraries: itineraries,
        });
    } catch (err) {
        console.log(err);
        res.send({
            itineraries: [],
        });
    }
});

// This route serves the function of creating and updating an itinerary.
router.post('/', async(req, res) => {
    let itinerary = new Itinerary.Builder()
        .setName(req.body.name)
        .setDescription(req.body.description)
        .setCreatorId(req.session.user._id)
        .setTravelGuideId(req.body.travelGuideIds)
        .setPublic(req.body.public)
        .build();

    try {
        if (req.body.itineraryId) {
            await ItineraryManager.updateItinerary(req.body.itineraryId, itinerary);
        } else {
            await ItineraryManager.createItinerary(itinerary);
        }
        res.send({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
        });
    }

});

router.delete('/', async (req, res) => {
    let itineraryId = req.query.id;
    try {
        await ItineraryManager.removeItinerary(itineraryId);
    } catch(err) {
        console.log(err);
        res.send({
            success: false
        })
    }
});

module.exports = router;