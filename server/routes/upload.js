import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config — audio files qofa
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];
  if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error("Audio files qofa (MP3, WAV, OGG)."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// POST /api/upload/audio — admin qofa
router.post("/audio", protect, adminOnly, upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File hin argamne." });
  }
  const audioUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: "Upload milkaa'e!",
    audioUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

export default router;
