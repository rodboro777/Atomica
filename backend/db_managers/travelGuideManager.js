"use strict";

var ObjectID = require('mongodb').ObjectID;
const TravelGuideModel = require("../models/travelGuideModel");

class TravelGuideManager {
  //returns a list of travel guides
  static async getTravelGuidesByPlaceId(placeId) {
    try {
      const docs = await TravelGuideModel.find({
        placeId: placeId,
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }

  //return a travel guide by id
  static async getTravelGuideById(id) {
    try {
      const doc = await TravelGuideModel.findById(id);
      return doc;
    } catch (err) {
      throw err;
    }
  }

  static async getTravelGuidesByUser(userId) {
    try {
      const docs = await TravelGuideModel.find({
        creatorId: new ObjectID(userId),
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TravelGuideManager;
