"use strict";

var ObjectID = require('mongodb').ObjectID;
const ItineraryModel = require("../models/itineraryModel");

class ItineraryManager {
  static async getItineraryById(id) {
    try {
      const doc = await ItineraryModel.findById(id);
      return doc;
    } catch (err) {
      throw err;
    }
  }

  static async getItineraryNameStartingWith(char) {
    try {
      const doc = await ItineraryModel.find({
        name: new RegExp("^" + char, "i"),
      });
      return doc;
    } catch (err) {
      throw err;
    }
  }

  //returns a list of itineraries
  static async getItinerariesByPlaceId(placeId) {
    try {
      const docs = await ItineraryModel.find({
        placeId: placeId,
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }

  static async getItinerariesByUser(userId) {
    try {
      const docs = await ItineraryModel.find({
        creatorId: new ObjectID(userId),
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ItineraryManager;
