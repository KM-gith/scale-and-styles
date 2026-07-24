import express from "express";
import Style from "../models/Style.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/styles — hundi argatu
router.get("/", async (req, res) => {
  try {
    const styles = await Style.find().sort({ name: 1 });
    res.json(styles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/styles/:id
router.get("/:id", async (req, res) => {
  try {
    const style = await Style.findById(req.params.id);
    if (!style) return res.status(404).json({ message: "Style hin argamne." });
    res.json(style);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/styles — admin qofa
router.post("/", protect, adminOnly, async (req, res) => {
  const { name, description, color } = req.body;
  try {
    const style = await Style.create({ name, description, color });
    res.status(201).json(style);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/styles/:id — admin qofa
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const style = await Style.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!style) return res.status(404).json({ message: "Style hin argamne." });
    res.json(style);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/styles/:id — admin qofa
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Style.findByIdAndDelete(req.params.id);
    res.json({ message: "Style haqame." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
