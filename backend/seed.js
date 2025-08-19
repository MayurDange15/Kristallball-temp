const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Base = require("./models/Base");
const Asset = require("./models/Asset");
const Movement = require("./models/Movement");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing
    await User.deleteMany();
    await Base.deleteMany();
    await Asset.deleteMany();
    await Movement.deleteMany();

    // Create bases
    const alpha = await Base.create({
      name: "Alpha Base",
      location: "North Sector",
    });
    const bravo = await Base.create({
      name: "Bravo Base",
      location: "South Sector",
    });
    const charlie = await Base.create({
      name: "Charlie Base",
      location: "East Sector",
    });
    const delta = await Base.create({
      name: "Delta Base",
      location: "West Sector",
    });
    const echo = await Base.create({
      name: "Echo Base",
      location: "Central Sector",
    });

    // Create users
    const users = await User.create([
      { username: "admin", password: "password", role: "admin" },
      {
        username: "cmdr_alpha",
        password: "password",
        role: "commander",
        base: alpha._id,
      },
      {
        username: "cmdr_bravo",
        password: "password",
        role: "commander",
        base: bravo._id,
      },
      {
        username: "log_alpha",
        password: "password",
        role: "logistics",
        base: alpha._id,
      },
      {
        username: "log_bravo",
        password: "password",
        role: "logistics",
        base: bravo._id,
      },
      {
        username: "log_charlie",
        password: "password",
        role: "logistics",
        base: charlie._id,
      },
      {
        username: "cmdr_delta",
        password: "password",
        role: "commander",
        base: delta._id,
      },
    ]);

    // Create assets
    const assets = await Asset.create([
      { name: "Tank", type: "vehicle", quantity: 5, base: alpha._id },
      { name: "Rifle", type: "weapon", quantity: 50, base: alpha._id },
      { name: "Ammo Box", type: "ammo", quantity: 200, base: alpha._id },
      { name: "Jeep", type: "vehicle", quantity: 3, base: bravo._id },
      { name: "Pistol", type: "weapon", quantity: 30, base: bravo._id },
      { name: "Ammo Box", type: "ammo", quantity: 150, base: bravo._id },
    ]);

    // Create movements (Purchases)
    await Movement.create([
      {
        asset: assets[0]._id,
        type: "purchase",
        quantity: 5,
        toBase: alpha._id,
        createdBy: users[0]._id,
      },
      {
        asset: assets[1]._id,
        type: "purchase",
        quantity: 50,
        toBase: alpha._id,
        createdBy: users[3]._id,
      },
      {
        asset: assets[2]._id,
        type: "purchase",
        quantity: 200,
        toBase: alpha._id,
        createdBy: users[3]._id,
      },
      {
        asset: assets[3]._id,
        type: "purchase",
        quantity: 3,
        toBase: bravo._id,
        createdBy: users[0]._id,
      },
      {
        asset: assets[4]._id,
        type: "purchase",
        quantity: 30,
        toBase: bravo._id,
        createdBy: users[4]._id,
      },
      {
        asset: assets[5]._id,
        type: "purchase",
        quantity: 150,
        toBase: bravo._id,
        createdBy: users[4]._id,
      },
    ]);

    // Create some assignments & expenditures
    await Movement.create([
      {
        asset: assets[1]._id,
        type: "assignment",
        quantity: 10,
        assignedTo: "Soldier A",
        createdBy: users[1]._id,
      },
      {
        asset: assets[2]._id,
        type: "expenditure",
        quantity: 20,
        createdBy: users[1]._id,
      },
    ]);

    // Create a transfer from Alpha to Bravo
    await Movement.create([
      {
        asset: assets[0]._id,
        type: "transfer_out",
        quantity: 2,
        fromBase: alpha._id,
        toBase: bravo._id,
        createdBy: users[0]._id,
      },
      {
        asset: assets[0]._id,
        type: "transfer_in",
        quantity: 2,
        fromBase: alpha._id,
        toBase: bravo._id,
        createdBy: users[0]._id,
      },
    ]);

    // Update asset quantities after transfers and assignments
    assets[0].quantity = 3; // Tank at Alpha
    assets[1].quantity = 40; // Rifle at Alpha
    assets[2].quantity = 180; // Ammo at Alpha
    await assets[0].save();
    await assets[1].save();
    await assets[2].save();

    console.log("Expanded demo data with assets & movements seeded");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err.message);
    process.exit(1);
  }
};

seedData();
