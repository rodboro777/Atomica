const mongoose = require('mongoose');

const travelGuideSchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    audioUrl: String,
    imageUrl: String,
    audioLength: Number,
    placeId: String,
    public: Boolean,
});


const TravelGuide = new mongoose.model('TravelGuide', travelGuideSchema);

module.exports = TravelGuide;