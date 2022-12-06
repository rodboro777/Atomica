"use strict";

const travelGuideModel = require("../models/travelGuideModel");

class TravelGuideManager {
  //returns a list of travel guides
  static async getTravelGuidesByPlaceId(placeId) {
    try {
      const docs = await travelGuideModel.find({
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
      const doc = await travelGuideModel.findById(id);
      return doc;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TravelGuideManager;
