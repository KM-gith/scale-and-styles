import express from "express";
import Scale from "../models/Scale.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/scales — hundi argatu
router.get("/", async (req, res) => {
  try {
    const scales = await Scale.find().sort({ origin: 1, name: 1 });
    res.json(scales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/scales/:id
router.get("/:id", async (req, res) => {
  try {
    const scale = await Scale.findById(req.params.id);
    if (!scale) return res.status(404).json({ message: "Scale hin argamne." });
    res.json(scale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/scales — admin qofa
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, origin, description, intervals, color } = req.body;
  try {
    const scale = await Scale.create({ name, origin, description, intervals, color });
    res.status(201).json(scale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/scales/:id — admin qofa
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const scale = await Scale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scale) return res.status(404).json({ message: "Scale hin argamne." });
    res.json(scale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/scales/:id — admin qofa
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Scale.findByIdAndDelete(req.params.id);
    res.json({ message: "Scale haqame." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
