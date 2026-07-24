import mongoose from "mongoose";

const styleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    // fkn: "Waltz", "Reggae", "Chickchikaa", "Wallo", "Ballad"
    description: { type: String },
    color: { type: String, default: "#5533aa" },
  },
  { timestamps: true }
);

export default mongoose.model("Style", styleSchema);
