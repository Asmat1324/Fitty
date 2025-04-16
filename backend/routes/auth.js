//backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Post from '../models/post.js'
import multer from 'multer';
import path from 'path';



const router = express.Router();

//configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'backend/uploads'); // folder to save uploaded files
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
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail || existingUsername) {
      return res.status(400).json({ msg: 'Email or Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: passwordHash,
      profilePicture: req.file?.key || ''
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/profile-picture/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const url = await generatePresignedUrl(process.env.AWS_BUCKET_NAME, key);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
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
router.post('/userPost', async (req, res) => {
    const { user, imageUri, caption, likes, comments } = req.body;
   try{
    let userID;
    const userDoc = await User.findById(user);
if (!userDoc) {
  return res.status(400).json({ msg: 'User not found in database' });
}
    console.log("USER ID: " + userDoc._id)
    if(user){
        userID= User.findById(user)
    }
    else{
        return res.status(400).json({ msg: 'USER NOT FOUND' });
    }

    const newPost = new Post({
        userID: userDoc._id,
        imageUri,
        caption,
        likes,
        comments,
    });
    await newPost.save();
    res.status(201).json({ msg: 'Post uploaded successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;