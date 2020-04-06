const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

    console.log("MongoDB konek gays...");
  } catch (err) {
    console.error(err.massage);
    process.exit(1);
  }
};

module.exports = connectDB;
