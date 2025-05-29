import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: "daai7k1y0",
  api_key: "165431272127353",
  api_secret: "02sjZlOGD5kJESh_wNThqhWE-rg",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

export { upload, cloudinary }; // Export cloudinary và upload