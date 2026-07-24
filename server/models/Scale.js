import mongoose from "mongoose";

const scaleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    // fkn: "Tizita Minor", "Baati Major", "Ambassel"
    origin: { type: String, enum: ["Ethiopian",], default: "Ethiopian" },
    description: { type: String },
    intervals: [{ type: Number }],
    color: { type: String, default: "#8B4513" },
  },
  { timestamps: true }
);

export default mongoose.model("Scale", scaleSchema);
