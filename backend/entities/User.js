"use strict";

class User {
  constructor(build) {
    if (arguments.length === 1 && this.validateBuild(build)) {
      const username = build.username;
      const googleId = build.googleId;
      const numberOfTravelGuidesCreated = build.numberOfTravelGuidesCreated;
      const numberOfItinerariesCreated = build.numberOfItinerariesCreated;

      Object.defineProperties(this, {
        username: {
          value: username,
          writable: false,
        },
        googleId: {
          value: googleId,
          writable: false,
        },
        numberOfTravelGuidesCreated: {
          value: numberOfTravelGuidesCreated,
          writable: false,
        },
        numberOfItinerariesCreated: {
          value: numberOfItinerariesCreated,
          writable: false,
        },
      });
    }
  }
  validateBuild(build) {
    return String(build.constructor) === String(User.Builder);
  }
  static get Builder() {
    class Builder {
      setUsername(username) {
        this.username = username;
        return this;
      }

      setGoogleId(googleId) {
        this.googleId = googleId;
        return this;
      }

      setNumberOfTravelGuidesCreated(numberOfTravelGuidesCreated) {
        this.numberOfTravelGuidesCreated = numberOfTravelGuidesCreated;
        return this;
      }

      setNumberOfItinerariesCreated(numberOfItinerariesCreated) {
        this.numberOfItinerariesCreated = numberOfItinerariesCreated;
        return this;
      }

      build() {
        return new User(this);
      }
    }
    return Builder;
  }
}

module.exports = User;
