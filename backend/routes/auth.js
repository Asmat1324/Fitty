//backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Post from '../models/post.js'
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

const router = express.Router();


//configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'backend/uploads'); // folder to save uploaded files
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       const ext = path.extname(file.originalname);
//       cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     }
//   });
  
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'fittyimages',      // or process.env.AWS_S3_BUCKET if you prefer
     // acl: 'public-read',         // makes the file publicly readable
      key: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    })
  });

  async function generatePresignedUrl(bucket, key, expiresIn = 60) {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn // in seconds
    };
    return s3.getSignedUrlPromise('getObject', params);
  }

//@route POST /register
//@desc Register a new user
//@access Public
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    console.log('Received file:', req.file);
  
    // The rest of your data from the request body
    const { firstname, lastname, username, email, password } = req.body;
  
    try {
      // 1) Check if user with same email or username exists
      let userByEmail = await User.findOne({ email });
      if (userByEmail) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
      let userByUsername = await User.findOne({ username });
      if (userByUsername) {
        return res.status(400).json({ msg: 'Username already exists' });
      }
  
      // 2) Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
  
      // 3) Prepare user document
      // If req.file is defined, store either the location (full URL) or the key
      let profilePicUrl = '';
      if (req.file) {
        // for S3 public read
        profilePicUrl = req.file.location;  // full S3 url
        // or if you want just the key => req.file.key;
      }
  
      const newUser = new User({
        firstname,
        lastname,
        username,
        email,
        password: passwordHash,
        profilePicture: profilePicUrl
      });
  
      // 4) Save new user
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