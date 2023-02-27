const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
const STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

const travelGuideRequestSchema = new mongoose.Schema({
    name: String,
    description: String,
    creatorId: ObjectID,
    audioUrl: String,
    imageUrl: String,
    audioLength: Number,
    placeId: String,
    status: {
        type: String,
        enum: [STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED],
    },
    reviewerComment: String,
    locationName: String,
});

const TravelGuideRequest = new mongoose.model('TravelGuideRequest', travelGuideRequestSchema);

module.exports = TravelGuideRequest;
module.exports.STATUS = STATUS;