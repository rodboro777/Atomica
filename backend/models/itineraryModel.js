const mongoose = require('mongoose');


const itinerarySchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    travelGuideId: [ObjectID],
    public: Boolean,
    rating: Double,
});

const Itinerary = new mongoose.model('Itinerary', itinerarySchema);


module.exports = Itinerary;