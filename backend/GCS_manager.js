const { Storage } = require("@google-cloud/storage");
const path = require("path");
const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../atomica-384322-fa515160432c.json"
  ),
  projectId: "atomica-384322",
});
const bucket = gc.bucket("atomica_bucket");

class GCSManager {

  // This function returns a url to the file
  static async uploadAudio(audio, id) {
    return await new Promise((resolve, reject) => {
      const blob = bucket.file(audio);
      blob.name = `${id}.${audio.mimetype.split("/")[1]}`;
      const blobStream = blob.createWriteStream();
      blobStream
        .on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        })
        .on("error", (err) => {
          console.log("this if GCS MANAGER: " + err);
          reject(`Unable to upload audio, something went wrong`);
        })
        .end(audio.buffer);
    });
  }
}

module.exports = GCSManager;