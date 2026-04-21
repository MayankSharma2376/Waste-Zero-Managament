const mongoose = require('mongoose');

const connectDb = async() => {
  try {
  const uri = process.env.MONGO_URI;
  const connection = await mongoose.connect(uri);
    console.log("Mongoose is connected to: ", connection.connection.host);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}


module.exports = connectDb;