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
        name: { $regex: char, $options: "i" },
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

  static async createItinerary(itinerary) {
    await ItineraryModel.create(this.constructItinerary(itinerary));
  }

  static async updateItinerary(itinerary, id) {
    await ItineraryModel.findByIdAndUpdate(id, this.constructItinerary(itinerary));
  }

  static async removeItinerary(itineraryId) {
    await ItineraryModel.findByIdAndDelete(itineraryId);
  }

  static constructItinerary(itinerary) {
    let travelGuideIds = [];
    itinerary.travelGuideId.forEach((e) => {
      travelGuideIds.push(new ObjectID(e));
    });
    return {
      name: itinerary.name,
      description: itinerary.description,
      creatorId: new ObjectID(itinerary.creatorId),
      travelGuideId: travelGuideIds,
      public: itinerary.isPublic,
    }
  }
}

module.exports = ItineraryManager;
