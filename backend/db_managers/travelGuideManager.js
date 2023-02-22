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

  static async getTravelGuidesByIds(ids) {
    try {
      const docs = await TravelGuideModel.find({
        _id: { $in: ids },
      });
      return docs;
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

  static async getPendingTravelGuidesByUser(userId) {
    const docs = await TravelGuideRequestModel.find({
      creatorId: new ObjectID(userId),
    });
    return docs;
  }

  static async getTravelGuideRequests(status) {
    try {
      const docs = await TravelGuideRequestModel.find({status: status});
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

  static async approveTravelGuideRequest(requestId, reviewerComment) {
    // change the status of the request to approved.
    const request = await TravelGuideRequestModel.findByIdAndUpdate(requestId, {
      status: TravelGuideRequestModel.STATUS.APPROVED,
      reviewerComment: reviewerComment,
    });

    // create a new travel guide from the request.
    await TravelGuideModel.create(this.constructTravelGuide(request));
  }

  static async rejectTravelGuideRequest(requestId, reviewerComment) {
    // change the status fo the request to rejected and add the reviewerComment.
    await TravelGuideRequestModel.findByIdAndUpdate(requestId, {
      status: TravelGuideRequestModel.STATUS.REJECTED,
      reviewerComment: reviewerComment,
    });
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
      public: true
    };
  }

  static async createTravelGuideRequest(request) {
    try {
      await TravelGuideRequestModel.create(
        {
          ...this.constructTravelGuide(request),
          status: TravelGuideRequestModel.STATUS.PENDING,
          reviewerComment: '',
        }
      );
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

  static async getTravelGuidesStartingWith(char) {
    try {
      const docs = await TravelGuideModel.find({
        name: { $regex: char, $options: "i" },
      });
      return docs;
    } catch (err) {
      throw err;
    }
  }

  static async getTravelGuidesAndItinerariesByPlaceId(placeId) {
    try {
      const docs = await TravelGuideModel.aggregate([
        {
          $match: {
            placeId: `${placeId}`,
          },
        },
        {
          $lookup: {
            from: "itineraries",
            localField: "_id",
            foreignField: "travelGuideId",
            as: "itineraries",
          },
        },
      ]);
      return docs;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TravelGuideManager;
