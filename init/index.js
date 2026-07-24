const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  console.log("Connecting to Database...");
  await mongoose.connect(dbUrl);
  console.log("Successfully connected to DB");
  await initDB();
}

async function initDB() {
  try {
    // Find or create a default host user for seeding listings
    let ownerUser = await User.findOne();
    if (!ownerUser) {
      console.log("No existing user found. Creating default admin host user...");
      const newUser = new User({ email: "admin@staywander.com", username: "admin" });
      ownerUser = await User.register(newUser, "admin123");
      console.log("Created host user: admin");
    }

    await Listing.deleteMany({});
    console.log("Cleared existing listings.");

    const preparedData = initData.data.map((obj) => ({
      ...obj,
      owner: ownerUser._id,
    }));

    await Listing.insertMany(preparedData);
    console.log(`Successfully seeded ${preparedData.length} listings into DB!`);
  } catch (err) {
    console.error("Error initializing DB:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

main().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});