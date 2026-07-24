import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, default: "Hin beekamu" },
    scale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scale",
      required: true,
    },
    style: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    audioUrl: { type: String, required: true }, // /uploads/filename.mp3
    duration: { type: String }, // fkn "3:45"
    description: { type: String },
    tags: [{ type: String }], // fkn ["faarfannaa"]
    plays: { type: Number, default: 0 }, // dhageeffannoo lakkoofsi
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
