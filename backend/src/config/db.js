const dns = require('dns');
// Configure robust public DNS resolvers to prevent Windows SRV ECONNREFUSED lookup failures
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in case DNS override is restricted
}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexachain_investment';
    
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true, // Ensure compound indexes are built
      serverSelectionTimeoutMS: 8000
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
