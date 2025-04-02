//backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './user.js';
import multer from 'multer';
import path from 'path';


const router = express.Router();
//Creating storage for pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // folder to save uploaded files
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
const upload = multer({ storage });
//@route POST /register
//@desc Register a new user
//@access Public
router.post('/register',upload.single('profileImage'), async (req, res) => {
    const {
        firstname, lastname, username, email, password
      } = req.body 
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            firstname,
            lastname,
            username,
            email,
            password: passwordHash,
            profilePicture: req.file.filename,
        });

        await user.save();
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
                const userObj = user.toObject();  
                delete userObj.password;  
            
                res.json({ token, user: userObj });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;