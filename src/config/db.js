// Imports Mongoose to connect to DB
import mongoose from 'mongoose'

// Connect to MongoDB
const connectDB = async () => {
    // Try and catch for error handling
    try {
        // Grabs mongoDB URI from .env file
        const connect = await mongoose.connect(process.env.MONGO_URI);
        // Console.log's once success fully connected to database
        console.log(`Successfully connected to MongoDB: ${connect.connection.host} `)
    } catch (err) {
        // Console.error's if there is an error and exits the application
        console.error(`Database connection error: ${err.message}`);
        process.exit();
    }
}



// Export so it can be called in index.js when needed to conenct to db
export default connectDB