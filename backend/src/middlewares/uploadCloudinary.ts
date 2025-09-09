import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: Date.now().toString(),
    };
  },
});
export const upload = multer({ storage });
