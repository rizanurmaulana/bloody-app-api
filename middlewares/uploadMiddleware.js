// middlewares/upload.js
import multer from "multer";
import path from "path";

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder tujuan upload
  },
  filename: function (req, file, cb) {
    // Simpan file dengan timestamp + nama asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter untuk hanya izinkan gambar
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname);
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Only images are allowed!"), false);
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maks 2MB
});

export default upload;
