const formidable = require('formidable')
const fs = require('fs')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const config = require('../config/config')
const path = require('path')

module.exports = {
  uploadPhotos: (req, res) => {
    let photos = [],
      form = new formidable.IncomingForm();

    // Tells formidable that there will be multiple files sent.
    form.multiples = true;
    // Upload directory for the images
    form.uploadDir = path.join(config.development.rootFolder, 'public/tmp_uploads');

    // Invoked when a file has finished uploading.
    form.on('file', function (name, file) {
      // Allow only 15 files to be uploaded.
      if (photos.length === 15) {
        fs.unlink(file.path);
        return true;
      }

      let buffer = null,
        type = null,
        filename = '';

      // Read a chunk of the file.
      buffer = readChunk.sync(file.path, 0, 262);
      // Get the file type using the buffer read using read-chunk
      type = fileType(buffer);

      // Check the file type, must be either png,jpg or jpeg
      if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
        // Assign new file name
        filename = Date.now() + '-' + file.name;

        // Move the file with the new file name
        fs.rename(file.path, path.join(config.development.rootFolder, 'public/images/' + filename));

        // Add to the list of photos
        photos.push({
          status: true,
          filename: filename,
          type: type.ext,
          publicPath: 'images/' + filename
        });
      } else {
        photos.push({
          status: false,
          filename: file.name,
          message: 'Invalid file type'
        });
        fs.unlink(file.path);
      }
    });

    form.on('error', function(err) {
      console.log('Error occurred during processing - ' + err);
    });

    // Invoked when all the fields have been processed.
    form.on('end', function() {
      console.log('All the request fields have been processed.');
      for (let photo of photos) console.log(photo.publicPath)

    });

    // Parse the incoming form fields.
    form.parse(req, function (err, fields, files) {
      res.status(200).json(photos);
    });
  }
}