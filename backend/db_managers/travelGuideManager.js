"use strict";

var ObjectID = require('mongodb').ObjectID;
const TravelGuideModel = require("../models/travelGuideModel");
const TravelGuideRequestModel = require('../models/travelGuideRequestModel');

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
    const docs = await TravelGuideRequestModel.find({});
    return docs;
  }

  static async removeTravelGuideRequest(requestId) {
    await TravelGuideRequestModel.findByIdAndDelete(new ObjectID(requestId));
  }

  static async createTravelGuideFromRequest(requestId) {
    try {
      const request = await TravelGuideRequestModel.findById(requestId);
      await TravelGuideModel.create(this.constructTravelGuide(request));
      await removeTravelGuideRequest(requestId);
      return true
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
    }
  }

  static async createTravelGuideRequest(request) {
    await TravelGuideRequestModel.create(this.constructTravelGuide(request));
  }

  static async updateTravelGuide(id, travelGuide) {
    await TravelGuideModel.findByIdAndUpdate(id, this.constructTravelGuide(travelGuide))
  }

  static async removeTravelGuide(id) {
    await TravelGuideModel.findByIdAndDelete(id);
  }
}

module.exports = TravelGuideManager;
