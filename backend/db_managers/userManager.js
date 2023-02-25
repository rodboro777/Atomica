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
            username: doc.username,
            firstName: doc.firstName,
            lastName: doc.lastName,
            country: doc.country,
        }
    }
}

module.exports = UserManager;
