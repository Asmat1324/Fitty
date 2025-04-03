//backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';



const router = express.Router();

//configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/profile_pictures'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } 
        cb(null, false); //reject unsupported files
        
    },
});
//@route POST /register
//@desc Register a new user
//@access Public
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const profilePicture = req.file ? '/uploads/profile_pictures/${req.file.filename}' : '';

    try {
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

       const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password: passwordHash,
            profilePicture: profilePicture,
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route POST /login
//@desc Authenticate user & get token
//@access Public
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        //Find user by username or email
        let user;
        if (username) {
            user = await User.findOne({ username });
        } else if (email) {
            user = await User.findOne({ email });
        }
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        console.log("Using JWT Secret:", process.env.JWT_SECRET);
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;