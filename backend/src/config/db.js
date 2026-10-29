const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexachain_investment';
    
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true // Ensure compound indexes are built
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Don't kill process immediately in dev so app can log meaningful errors
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
