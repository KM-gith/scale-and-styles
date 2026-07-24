import express from "express";
import Song from "../models/Song.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/songs — hundi argatu (scale + style filter danda'a)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.scale) filter.scale = req.query.scale;
    if (req.query.style) filter.style = req.query.style;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { artist: { $regex: req.query.search, $options: "i" } },
      ];
    }
    const songs = await Song.find(filter)
      .populate("scale", "name color origin")
      .populate("style", "name color")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/songs/:id
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate("scale", "name color origin description")
      .populate("style", "name color description")
      .populate("uploadedBy", "name");
    if (!song) return res.status(404).json({ message: "Faarfannaan hin argamne." });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/songs — admin qofa
router.post("/", protect, adminOnly, async (req, res) => {
  const { title, artist, scale, style, audioUrl, duration, description, tags } = req.body;
  try {
    const song = await Song.create({
      title, artist, scale, style, audioUrl,
      duration, description, tags,
      uploadedBy: req.user._id,
    });
    const populated = await Song.findById(song._id)
      .populate("scale", "name color origin")
      .populate("style", "name color");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/songs/:id — admin qofa
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("scale", "name color origin")
      .populate("style", "name color");
    if (!song) return res.status(404).json({ message: "Faarfannaan hin argamne." });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/songs/:id — admin qofa
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Faarfannaan haaqame." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/songs/:id/play — plays count dabaluu
router.put("/:id/play", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    res.json({ plays: song.plays });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
