import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))

    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) throw new Error("MongoDB connection string not found. Set MONGO_URI or MONGODB_URI in your environment")

    // `uri` may already include the database name (e.g. mongodb://host:27017/prescripto)
    await mongoose.connect(uri)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.