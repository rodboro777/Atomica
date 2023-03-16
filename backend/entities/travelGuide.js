"use strict";

class TravelGuide {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const name = build.name;
      const description = build.description;
      const creatorId = build.creatorId;
      const audioUrl = build.audioUrl;
      const imageUrl = build.imageUrl;
      const audioLength = build.audioLength;
      const placeId = build.placeId;
      const isPublic = build.isPublic;
      const locationName = build.locationName;
      const coordinates = build.coordinates;

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
        audioUrl: {
          value: audioUrl,
          writable: false,
        },
        imageUrl: {
          value: imageUrl,
          writable: false,
        },
        audioLength: {
          value: audioLength,
          writable: false,
        },
        placeId: {
          value: placeId,
          writable: false,
        },
        isPublic: {
          value: isPublic,
          writable: false,
        },
        locationName: {
          value: locationName,
          writable: false,
        },
        coordinates: {
          value: coordinates,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(TravelGuide.Builder);
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

      setAudioUrl(audioUrl) {
        this.audioUrl = audioUrl;
        return this;
      }

      setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
        return this;
      }

      setAudioLength(audioLength) {
        this.audioLength = audioLength;
        return this;
      }

      setPlaceId(placeId) {
        this.placeId = placeId;
        return this;
      }

      setIsPublic(isPublic) {
        this.isPublic = isPublic;
        return this;
      }

      setLocationName(locationName) {
        this.locationName = locationName;
        return this;
      }

      setCoordinates(coordinates) {
        this.coordinates = coordinates;
        return this;
      }

      build() {
        return new TravelGuide(this);
      }
    }
    return Builder;
  }
}

module.exports = TravelGuide;
