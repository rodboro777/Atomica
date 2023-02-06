"use strict";

const UserModel = require("../models/userModel");

class UserManager {
    static async getUsernameById(id) {
        const doc = await UserModel.findById(id);
        return doc.username;
    }
}

module.exports = UserManager;
