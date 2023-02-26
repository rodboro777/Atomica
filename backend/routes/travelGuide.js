const router = require("express").Router();
const TravelGuideManager = require("../db_managers/TravelGuideManager");
const TravelGuide = require("../entities/TravelGuide");
const GCSManager = require("../GCS_manager");
const multer = require("multer");
const upload = multer();
const crypto = require("crypto");
const TravelGuideRequestModel = require("../models/travelGuideRequestModel");

router.use((err, req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send({
      statusCode: 403,
    });
  }
});

router.get("/", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    console.log("No id included in the request body");
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
});


router.post("/byIds", async (req, res) => {
  const ids = req.body;
  if (!ids) {
    console.log("No ids included in the request body");
    res.send({
      travelGuides: [],
    });
  }
  try {
    const travelGuides = await TravelGuideManager.getTravelGuidesByIds(ids);
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

router.get("/byLocation", async (req, res) => {
  const placeId = req.query.placeId;
  if (!placeId) {
    console.log("No location id included in the request body");
    res.send({
      travelGuides: [],
    });
  }

  try {
    const results = await TravelGuideManager.getTravelGuidesAndItinerariesByPlaceId(
      placeId
    );
    res.send({
      results: results,
    });
  } catch (err) {
    console.log(err);
    res.send({
      results: [],
    });
  }
});

router.get("/byCreator", async (req, res) => {
  const creatorId = req.query.creatorId;

  try {
    const travelGuides = await TravelGuideManager.getTravelGuidesByUser(creatorId);

    let pendingTravelGuides = [];
    let rejectedTravelGuides = [];

    if (req.session.user._id == creatorId) {
      pendingTravelGuides = await TravelGuideManager.getTravelGuideRequestsByUser(creatorId, TravelGuideRequestModel.STATUS.PENDING);
      rejectedTravelGuides = await TravelGuideManager.getTravelGuideRequestsByUser(creatorId, TravelGuideRequestModel.STATUS.REJECTED);
    }

    res.send({
      statusCode: 200,
      travelGuides: travelGuides,
      pendingTravelGuides: pendingTravelGuides,
      rejectedTravelGuides: rejectedTravelGuides,
    });
  } catch (err) {
    console.log(err);
    res.send({
      statusCode: 500,
      travelGuides: [],
      pendingTravelGuides: [],
      rejectedTravelGuides: [],
    });
  }
});

router.get("/byUser", async (req, res) => {
  const userId = req.session.user._id;
  if (!userId) {
    console.log("No user id provided");
    res.send({
      travelGuides: [],
    });
  }

  try {
    const travelGuides = await TravelGuideManager.getTravelGuidesByUser(userId);
    const pendingTravelGuides = await TravelGuideManager.getTravelGuideRequestsByUser(userId, TravelGuideRequestModel.STATUS.PENDING);
    const rejectedTravelGuides = await TravelGuideManager.getTravelGuideRequestsByUser(userId, TravelGuideRequestModel.STATUS.REJECTED);
    res.send({
      travelGuides: travelGuides,
      pendingTravelGuides: pendingTravelGuides,
      rejectedTravelGuides: rejectedTravelGuides,
    });
  } catch (err) {
    console.log(err);
    res.send({
      travelGuides: [],
      pendingTravelGuides: [],
      rejectedTravelGuides: [],
    });
  }
});

// Get pending TravelGuide applications
router.get("/applications", async (req, res) => {
  if (!req.query.status) {
    res.send({
      travelGuidesRequests: [],
    })
  }

  const travelGuidesRequests =
    await TravelGuideManager.getTravelGuideRequests(req.query.status);
  res.send({
    travelGuidesRequests: travelGuidesRequests,
  });
});

// Action towards an existing TravelGuide application.
router.post("/applicationAction", async (req, res) => {
  // the variable approve must be a boolean value. if true, it means that
  // the request will be approved. otherwise it will be rejected.
  const approve = req.body.approve;
  const requestId = req.body.requestId;
  const reviewerComment = req.body.reviewerComment;
  try {
    if (approve) {
      await TravelGuideManager.approveTravelGuideRequest(requestId, reviewerComment);
    } else {
      await TravelGuideManager.rejectTravelGuideRequest(requestId, reviewerComment);
    }
    res.send({
      statusCode: 200,
    });
  } catch (err) {
    console.log(err);
    res.send({
      statusCode: 500,
    });
  }
});

router.post(
  "/",
  upload.fields([{ name: "audio" }, { name: "image" }]),
  async (req, res) => {
    try {
      const mm = await import('music-metadata');
      console.log(req.body);
      const audio = req.files.audio[0];
      const metadata = await mm.parseBuffer(audio.buffer, audio.mimetype);
      const duration = metadata.format.duration;
      // upload the audio
      const id = crypto.randomBytes(64).toString('hex');
      const audioUrl = await GCSManager.uploadAudio(
        req.files.audio[0],
        `tg-audio-${id}`
      );

      // upload the image
      let imageUrl = '';
      if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
      } else {
        imageUrl = await GCSManager.uploadAudio(
          req.files.image[0],
          `tg-image-${id}`
        );
      }

      // create TravelGuideRequest.
      let request = new TravelGuide.Builder()
        .setName(req.body.name)
        .setDescription(req.body.description)
        .setCreatorId(req.session.user._id)
        .setAudioUrl(audioUrl)
        .setImageUrl(imageUrl)
        .setAudioLength(duration)
        .setPlaceId(req.body.placeId)
        .build();
      await TravelGuideManager.createTravelGuideRequest(request);
      res.send({
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      res.send({
        statusCode: 500,
      });
    }
  }
);

router.get("/startsWith", async (req, res) => {
  const prefix = req.query.prefix;
  try {
    const travelGuides = await TravelGuideManager.getTravelGuidesStartingWith(
      prefix
    );
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

router.delete("/", async (req, res) => {
  try {
    await TravelGuideManager.removeTravelGuide(req.query.id);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
