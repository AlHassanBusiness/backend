const multer = require('multer');
const path = require('path');
const ImageKit = require('imagekit');
const fs = require('fs');
const dotenv = require('dotenv')

dotenv.config()



// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});




// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});



// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // Single file upload




// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}



// Function to upload to ImageKit
async function uploadToImageKit(filePath, fileName) {
  const file = fs.readFileSync(filePath);

  try {
    const response = await imagekit.upload({
      file: file, // required
      fileName: fileName, // required
    });
    // Delete the file from local storage after uploading to ImageKit
    fs.unlinkSync(filePath);
    return response.url;
  } catch (error) {
    console.error('Upload to ImageKit failed:', error);
    throw error;
  }
}



// Middleware to handle the entire process
const handleUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    try {
      const imageUrl = await uploadToImageKit(req.file.path, req.file.filename);
      res.json({ imageUrl: imageUrl });
    } catch (error) {
      res.status(500).send('Image upload failed');
    }
  });
};

module.exports = {upload,uploadToImageKit}
