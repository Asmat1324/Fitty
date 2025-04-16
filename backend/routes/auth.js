//backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Post from '../models/post.js'
import fs from 'fs';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();


// AWS v3 S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Multer disk storage (we'll manually upload to S3 after)
const upload = multer({ dest: 'tempUploads/' });

async function generatePresignedUrl(bucket, key, expiresIn = 60) {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: expiresIn
  };
  return s3.getSignedUrlPromise('getObject', params);
}

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

    let profilePicKey = '';

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const key = `profilePicture-${Date.now()}${ext}`;

      const fileStream = fs.createReadStream(req.file.path);

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: req.file.mimetype,
      }));

      // cleanup temp file
      fs.unlink(req.file.path, () => {});
      profilePicKey = key;
    }

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: passwordHash,
      profilePicture: profilePicKey
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('🔥 REGISTER ERROR:', err); // log the full error object
    res.status(500).json({ msg: 'Server error', error: err.message || 'Unknown error' });
  }
});

router.get('/profile-picture/:key', async (req, res) => {
  const { key } = req.params;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
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