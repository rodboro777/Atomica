"use strict";

var ObjectID = require("mongodb").ObjectID;
const TravelGuideModel = require("../models/travelGuideModel");
const TravelGuideRequestModel = require("../models/travelGuideRequestModel");

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

  static async getTravelGuideRequests() {
    try {
      const docs = await TravelGuideRequestModel.find({});
      return docs;
    } catch (err) {
      throw err;
    }
  }

  static async removeTravelGuideRequest(requestId) {
    try {
      await TravelGuideRequestModel.findByIdAndDelete(new ObjectID(requestId));
    } catch (err) {
      throw err;
    }
  }

  static async createTravelGuideFromRequest(requestId) {
    try {
      const request = await TravelGuideRequestModel.findById(requestId);
      await TravelGuideModel.create(this.constructTravelGuide(request));
      await TravelGuideRequestModel.findByIdAndDelete(new ObjectID(requestId));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static constructTravelGuide(request) {
    return {
      name: request.name,
      description: request.description,
      creatorId: request.creatorId,
      audioUrl: request.audioUrl,
      imageUrl: request.imageUrl,
      audioLength: request.audioLength,
      placeId: request.placeId,
      public: true,
    };
  }

  static async createTravelGuideRequest(request) {
    try {
      await TravelGuideRequestModel.create(this.constructTravelGuide(request));
    } catch (err) {
      throw err;
    }
  }

  static async updateTravelGuide(id, travelGuide) {
    try {
      await TravelGuideModel.findByIdAndUpdate(
        id,
        this.constructTravelGuide(travelGuide)
      );
    } catch (err) {
      throw err;
    }
  }

  static async removeTravelGuide(id) {
    try {
      await TravelGuideModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  static async getTravelGuidesStartingWith(char){
    try {
      const docs = await TravelGuideModel.find({
        name: { $regex: char, $options: "i" },
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TravelGuideManager;
