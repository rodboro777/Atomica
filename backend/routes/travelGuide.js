const router = require('express').Router();
const TravelGuideManager = require('../db_managers/TravelGuideManager');

router.use((err, req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.send({
            statusCode: 403,
        });
    }
});

router.get('/', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        console.log('No id included in the request body');
        res.send({
            travelGuide: null,
        });
    }
    try {
        const travelGuide = await TravelGuideManager.getTravelGuideById(id);
        res.send({
            travelGuide: travelGuide,
        });
    } catch (err) {
        console.log(err);
        res.send({
            travelGuide: null,
        });
    }
})

router.get('/byLocation', async (req, res) => {
    const placeId = req.query.placeId;
    if (!placeId) {
        console.log('No location id included in the request body');
        res.send({
            travelGuides: [],
        });
    }

    try {
        const travelGuides = await TravelGuideManager.getTravelGuidesByPlaceId(placeId);
        res.send({
            travelGuides: travelGuides,
        });
    } catch (err) {
        console.log(err);
        res.send({
            travelGuides: [],
        });
    }
});

module.exports = router;