const router = require("express").Router();
const ItineraryManager = require("../db_managers/ItineraryManager");
const Itinerary = require("../entities/Itinerary");
const multer = require("multer");
const GCSManager = require("../GCS_manager");
const upload = multer();
const crypto = require("crypto");

router.use((err, req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send({
      statusCode: 403,
    });
  }
});

router.post("/namestartsWith", async (req, res) => {
  const starting = req.body.starting;
  try {
    const itineraries = await ItineraryManager.getItineraryNameStartingWith(
      starting
    );
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

router.get("/byLocation", async (req, res) => {
  const placeId = req.query.placeId;
  if (!placeId) {
    console.log("No location id included in the request body");
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
    });
  }
});

router.get("/byCreator", async (req, res) => {
  const creatorId = req.query.creatorId;

  try {
    const itineraries = await ItineraryManager.getItinerariesByUser(creatorId);
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

router.get("/byUser", async (req, res) => {
  const userId = req.session.user._id;
  if (!userId) {
    console.log("No user id provided");
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
router.post("/", upload.fields([{ name: "imageFile" }]), async (req, res) => {
  const id = crypto.randomBytes(64).toString("hex");
  let imageUrl = "";
  if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  } else {
    (imageUrl = await GCSManager.uploadAudio(req.files.imageFile[0], id)),
      `iti-image-${id}`;
  }
  let itinerary = new Itinerary.Builder()
    .setName(req.body.name)
    .setDescription(req.body.description)
    .setCreatorId(req.body.creatorId ? req.body.creatorId : req.session.user._id)
    .setTravelGuideId(JSON.parse(req.body.travelGuideId))
    .setPublic(req.body.public)
    .setRating(req.body.itineraryId ? req.body.rating : 0)
    .setRatingCount(req.body.itineraryId ? req.body.ratingCount : 0)
    .setImageUrl(imageUrl)
    .build();
  try {
    if (req.body.itineraryId) {
      const doc = await ItineraryManager.updateItinerary(
        req.body.itineraryId,
        itinerary
      );
      res.send({
        success: true,
        result: doc,
      });
      return;
    }
    await ItineraryManager.createItinerary(itinerary);
    res.send({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
    });
  }
});

router.delete("/", async (req, res) => {
  let itineraryId = req.query.id;
  try {
    await ItineraryManager.removeItinerary(itineraryId);
    res.send({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
    });
  }
});

router.get("/totalTime", async (req, res) => {
  try {
    const itineraryId = req.query.id;
    const totalTime = await ItineraryManager.getTotalTime(itineraryId);
    res.send({
      statusCode: 200,
      totalTime: totalTime,
    });
  } catch (err) {
    console.log(err);
    res.send({
      statusCode: 500,
    });
  }
});

module.exports = router;
