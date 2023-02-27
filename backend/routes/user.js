require('dotenv').config();
const router = require('express').Router();
const UserManager = require('../db_managers/userManager');
const GCSManager = require("../GCS_manager");
const multer = require("multer");
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

router.get("/username", async (req, res) => {
    try {
        const id = req.query.id;
        const username = await UserManager.getUsernameById(id);
        res.send({
            statusCode: 200,
            username: username,
        })
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500
        })
    }
});

router.get("/info", async (req, res) => {
  try {
    const id = req.query.id;
    const info = await UserManager.getInfoById(id);
    res.send({
      statusCode: 200,
      info: info,
    })
  } catch (err) {
    console.log(err);
    res.send({
      statusCode: 500
    });
  }
});

router.post("/editInfo", upload.fields([{name: "image"}]), async(req, res) => {
  try {
    console.log(req.files);
    let imageUrl = "";
    if (req.files.image) {
      const id = crypto.randomBytes(64).toString('hex');
      imageUrl = await GCSManager.uploadAudio(req.files.image[0], `user-image-${id}`);
    }
    await UserManager.editInfo(req.session.user._id, {
      imageUrl: imageUrl.length > 0 ? imageUrl : null,
      country: req.body.country,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username
    });
    res.send({
      statusCode: 200
    });
  } catch (err) {
    console.log(err);
    res.send({
      statusCode: 500
    });
  }
});

module.exports = router;