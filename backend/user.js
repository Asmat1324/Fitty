//User Model



import mongoose from 'mongoose';



const UserSchema = new mongoose.Schema({

    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    createdAt: { type: Date, default: Date.now }

    //weight: { type: Number },

    //goalWeight: { type: Number },

    //height: { type: Number },

    //age: { type: Number },

    //gender: { type: String, enum: ['Male', 'Female', 'Other']},

    //dietRestrictions: { type: [String]},

    //activityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Active', 'Very Active']},

});



export default mongoose.model('user', UserSchema);