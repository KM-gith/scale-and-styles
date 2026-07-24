/**
 * Seed Script — Scales, Styles fi Admin user uumi
 * Fayyadami: node seed.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scale from "./models/Scale.js";
import Style from "./models/Style.js";
import User from "./models/User.js";

dotenv.config();

const scales = [

  {
    name: "Tizita ",
    origin: "Ethiopian",
    color: "#CD853F",
  },

  {
    name: "Baati",
    origin: "Ethiopian",
    color: "#4682B4",
  },
  {
    name: "Ambassel",
    origin: "Ethiopian",
    color: "#800080",
  },
  {
    name: "Anchihoye",
    origin: "Ethiopian",
    color: "#FF6347",
  },
  {
    name: "Waltz Major",
    origin: "Western",
    color: "#4169E1",
  },
  {
    name: "Blues",
    origin: "Western",
    color: "#191970",
  },
];

const styles = [
  { name: "Waltz", color: "#4169E1" },
  { name: "Reggae",  color: "#078930" },
  { name: "Chickchikaa",  color: "#FF6347" },
  { name: "Wallo",  color: "#800080" },
  { name: "Ballad",  color: "#2F4F4F" },
  { name: "Slow Rock",  color: "#191970" },
  { name: "Disco",  color: "#DAA520" },
  { name: "Gurage",  color: "#CD853F" },
  { name: "Tigre",  color: "#DA121A" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Scales haaqi fi haaraa dabalii
    await Scale.deleteMany();
    const createdScales = await Scale.insertMany(scales);
    console.log(`✅ Scales ${createdScales.length} uumaman`);

    // Styles haaqi fi haaraa dabalii
    await Style.deleteMany();
    const createdStyles = await Style.insertMany(styles);
    console.log(`✅ Styles ${createdStyles.length} uumaman`);

    // Admin user uumi (yoo hin jirre)
    const exists = await User.findOne({ email: "admin@faarfannoo.com" });
    if (!exists) {
      await User.create({
        name: "Admin",
        email: "admin@faarfannoo.com",
        password: "admin123456",
        role: "admin",
      });
      console.log("✅ Admin user uumame — email: kitesamerga2025@gmail.com | password: 1234");
    } else {
      console.log("ℹ️  Admin user duraan jira");
    }

    console.log("🎉 Seed xummurame!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed dogoggore:", err);
    process.exit(1);
  }
}

seed();
