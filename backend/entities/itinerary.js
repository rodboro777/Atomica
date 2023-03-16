"use strict";

class Itinerary {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const name = build.name;
      const description = build.description;
      const creatorId = build.creatorId;
      const travelGuideId = build.travelGuideId;
      const isPublic = build.isPublic;
      const rating = build.rating;
      const ratingCount = build.ratingCount;
      const imageUrl = build.imageUrl;

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
        isPublic: {
          value: isPublic,
          writable: false,
        },
        rating: {
          value: rating,
          writable: false,
        },
        ratingCount: {
          value: ratingCount,
          writable: false,
        },
        imageUrl: {
          value: imageUrl,
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

      setPublic(isPublic) {
        this.isPublic = isPublic;
        return this;
      }

      setRating(rating) {
        this.rating = rating;
        return this;
      }
      setRatingCount(ratingCount) {
        this.ratingCount = ratingCount;
        return this;
      }
      setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
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
