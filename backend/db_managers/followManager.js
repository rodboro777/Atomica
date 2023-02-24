"use strict"

const FollowModel = require("../models/FollowModel");
var ObjectID = require("mongodb").ObjectID;

class FollowManager {
    static follow(followerId, followedId) {
        FollowModel.create({
            followerId: followerId,
            followedId: followedId
        });
    }
    
    static unfollow(followerId, followedId) {
        FollowModel.findOneAndDelete({
           followerId: followerId,
           followedId: followedId 
        });
    }

    static async countFollowerOf(userId) {
        const count = await FollowModel.countDocuments({
            followedId: new ObjectID(userId),
        })
        return count;
    }

    static async countFollowingOf(userId) {
        const count = await FollowModel.countDocuments({
            followerId: new ObjectID(userId),
        });
        return count;
    }
}

module.exports = FollowManager;