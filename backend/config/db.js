const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // options like useNewUrlParser and useUnifiedTopology are not supported in Mongoose 7+
    // The driver now uses these behaviors by default.
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/secure_shop');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;