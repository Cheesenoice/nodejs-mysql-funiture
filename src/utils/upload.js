const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "furniture_products",
  });
  return { url: result.secure_url, public_id: result.public_id };
};

const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, uploadImage, deleteImage };
