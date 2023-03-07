"use strict";

var ObjectID = require("mongodb").ObjectID;
const ItineraryModel = require("../models/itineraryModel");
const TravelGuideModel = require("../models/travelGuideModel");

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

  static async updateItinerary(id, itinerary) {
    const updatedIti = this.constructItinerary(itinerary);
    console.log(updatedIti.travelGuideId);
    return await ItineraryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: updatedIti.name,
          description: updatedIti.description,
          travelGuideId: updatedIti.travelGuideId,
          creatorId: updatedIti.creatorId,
          rating: updatedIti.rating,
          ratingCount: updatedIti.ratingCount,
          imageUrl: updatedIti.imageUrl,
        },
      },
      { new: true }
    );
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
      ratingCount: itinerary.ratingCount,
      imageUrl: itinerary.imageUrl,
    };
  }

  static async getTotalTime(itineraryId) {
    const itinerary = await ItineraryModel.findById(itineraryId);
    let travelGuideIds = itinerary.travelGuideId;
    let travelGuides = await TravelGuideModel.find({
      _id: { $in: travelGuideIds },
    });
    let totalTime = 0;
    for (let i = 0; i < travelGuides.length; i++) {
      totalTime += travelGuides[i].audioLength;
    }
    return totalTime;
  }
}

module.exports = ItineraryManager;
