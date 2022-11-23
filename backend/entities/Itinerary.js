"use strict";

class Itinerary {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const name = build.name;
      const description = build.description;
      const creatorId = build.creatorId;
      const travelGuideId = build.travelGuideId;
      const public = build.public;
      const rating = build.rating;

      Object.defineProperties(this, {
        name: {
          value: name,
          writable: false,
        },
        description: {
          value: description,
          writable: false,
        },
        creatorId: {
          value: creatorId,
          writable: false,
        },
        travelGuideId: {
          value: travelGuideId,
          writable: false,
        },
        public: {
          value: public,
          writable: false,
        },
        rating: {
          value: rating,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(Itinerary.Builder);
  }
  static get Builder() {
    class Builder {
      setName(name) {
        this.name = name;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      setCreatorId(creatorId) {
        this.creatorId = creatorId;
        return this;
      }

      setTravelGuideId(travelGuideId) {
        this.travelGuideId = travelGuideId;
        return this;
      }

      setPublic(public) {
        this.public = public;
        return this;
      }

      setRating(rating) {
        this.rating = rating;
        return this;
      }
      build() {
        return new Itinerary(this);
      }
    }
    return Builder;
  }
}

module.exports = Itinerary;
