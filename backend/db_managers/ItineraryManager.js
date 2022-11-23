"use strict";

const ItineraryModel = require("../models/itineraryModel");

class ItineraryManager {
    
    static async getItineraryNameStartingWith(char){
        try{
            const doc = await ItineraryModel.find({name: new RegExp("^" + char, "i")});
            return doc;
        }
        catch(err){
            throw err;
        }
    }

}

module.exports = ItineraryManager;
