"use strict"

const FollowModel = require("../models/FollowModel");
var ObjectID = require("mongodb").ObjectID;

class FollowManager {
    static async follow(followerId, followedId) {
        await FollowModel.create({
            followerId: followerId,
            followedId: followedId
        });
    }
    
    static async unfollow(followerId, followedId) {
        await FollowModel.findOneAndDelete({
           followerId: followerId,
           followedId: followedId 
        });
    }

    static async countFollowerOf(userId) {
        console.log(userId);
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

    static async isFollowing(followerId, followedId) {
        const doc = await FollowModel.findOne({
            followerId: new ObjectID(followerId),
            followedId: new ObjectID(followedId)
        });
        return doc ? true : false;
    }
}

module.exports = FollowManager;