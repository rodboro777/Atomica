"use strict";

const ItineraryModel = require("../models/itineraryModel");

class ItineraryManager {

    static async getItineraryById(id){
        try{
            const doc = await ItineraryModel.findById(id);
            return doc;
        }catch(err){
            throw err;
        }
    }
    
    static async getItineraryNameStartingWith(char){
        try{
            const doc = await ItineraryModel.find({name: new RegExp("^" + char, "i")});
            return doc;
        }
        catch(err){
            throw err;
        }
    }

    static async getItinerariesByPlaceId(placeId) {
        return [];ß
    }

}

module.exports = ItineraryManager;
