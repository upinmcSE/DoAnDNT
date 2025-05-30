import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: "#",
  api_key: "#",
  api_secret: "#",
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
