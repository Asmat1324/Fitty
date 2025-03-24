//backend/ db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();
mongoose.set('strictQuery', true);
console.log('MongoDB URI: ', process.env.MONGO_URI);
const connectDB = async () => {
    try {
       await mongoose.connect("mongodb+srv://asmat:khan1122@cluster0.uisle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;