"use strict";

const UserModel = require("../models/userModel");

class UserManager {
    static async getUsernameById(id) {
        const doc = await UserModel.findById(id);
        return doc.username;
    }

    static async getInfoById(id) {
        const doc = await UserModel.findById(id);
        return {
            _id: doc._id,
            username: doc.username,
            firstName: doc.firstName,
            lastName: doc.lastName,
            country: doc.country,
            imageUrl: doc.imageUrl ? doc.imageUrl : "https://khoinguonsangtao.vn/wp-content/uploads/2022/07/avatar-gau-cute.jpg"
        }
    }

    static async editInfo(id, info) {
        await UserModel.findByIdAndUpdate(id, {
            username: info.username,
            firstName: info.firstName,
            lastName: info.lastName,
            country: info.country,
            imageUrl: info.imageUrl
        })
    }
}

module.exports = UserManager;
