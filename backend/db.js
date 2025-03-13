//backend/ db.js



import mongoose from 'mongoose';

import dotenv from 'dotenv';



dotenv.config();



mongoose.set('strictQuery', true);



console.log('MongoDB URI: ', process.env.MONGO_URI);



const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI, {

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