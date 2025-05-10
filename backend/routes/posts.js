//backend/posts.js
import express from 'express';
import Post from '../models/post.js';
import auth from '../middleware.js';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

//AWS S3 client setup
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

//Multer setup for temporary file storage
const upload = multer({ dest: 'tempUploads/' });

// @route POST /api/posts
// @desc Create a new post
// @access Private (requires authentication)
router.post(
    '/',
    [
        auth,
        upload.single('image'),
        [
            check('caption').optional(),
        ],
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
        }

        //check if image is provided
        if (!req.file) {
            return res.status(400).json({ msg: 'Image is required' });
        }

        //console.log('User ID from token:', req.user.id);
        //console.log('File received:', req.file);
        //console.log('Caption:', req.body.caption);

        //upload image to S3
        const ext = path.extname(req.file.originalname);
        const key = `post-${Date.now()}${ext}`;
        const fileStream = fs.createReadStream(req.file.path);

      /*  console.log('Uploading to S3:', {
            bucket: process.env.AWS_BUCKET_NAME,
            key: key,
            contentType: req.file.mimetype,
        });
*/
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: fileStream,
            ContentType: req.file.mimetype,
        }));

        //clean up temporary file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        //create and save new post
        const newPost = new Post({
            userID: req.user.id,
            imageUri: key, 
            caption: req.body.caption || '',
            likes: [],
            comments: [],
        });

      //  console.log('Creating post:', newPost);
        const post = await newPost.save();

      //  console.log('Post created successfully:', post);
        res.status(201).json(post);
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
);

//@route GET /api/posts
//@desc Get all posts, sorted by newest first, with user infor
// @access Private (users need to be logged in to see the feed)
router.get('/', auth, async (req, res) => {
    try {
       // console.log('GET /api/posts requested by user:', req.user.id);

        const posts = await Post.find()
        .sort({ date_created: -1 })
        .populate('userID', ['username', 'firstname', 'lastname', 'profilePicture']);

     //   console.log(`Found ${posts.length} posts`);
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

//@route GET /api/posts/user
//@desc Get all posts for the current user
//@access Private
router.get('/user', auth, async (req, res) => {
    try {
      //  console.log('Fetching posts for user:', req.user.id);

        const posts = await Post.find({ userID: req.user.id})
        .sort({ date_created: -1 });

       // console.log(`Found ${posts.lenght} posts for user ${req.user.id}`);
        res.json(posts);
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

//@route DELETE /api/posts/:id
//@desc Delete a post
//@access Private (only the user who created the post can delete it)
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Delete post request:', req.params.id);

        const post = await Post.findById(req.params.id);

        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).json({ msg: 'Post not found' });
        }

        //check if the post belongs to the user
        if (post.userID.toString() !== req.user.id) {
            console.log('Unauthorized delete attempt by', req.user.id);
            return res.status(401).json({ msg: 'User not authorized to delete this post' });
        }
        //potentially add code to delete image from s3

        await post.deleteOne();
        console.log('Post deleted successfully');
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error('Error deleting posting:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

//@route PUT /api/posts/like/:id
//@desc Like or unlike post
//@access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
      //  console.log('Like/unlike request for post:', req.params.id, 'by user:', req.user.id);

        const post = await Post.findById(req.params.id);

        if (!post) {
           // console.log('Post not found:', req.params.id);
            return res.status(404).json({ msg: 'Post not found' });
        }

        //check if user already liked the post
        const userLikedIndex = post.likes.findIndex(
            (like) => like.user.toString() === req.user.id
        );

        if (userLikedIndex === -1){
            //add the like
            post.likes.unshift({ user: req.user.id });
        } else {
            //remove the like
            post.likes.splice(userLikedIndex, 1);
        }

        await post.save();
        // console.log(`Post ${req.params.id} liked/unliked, new count: ${post.likes.length}`);
        res.json(post);
    } catch (err) {
        console.error('Error liking/unliking post:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});
/*
//@route PUT /api/posts/unlike/:id
//@desc Unlike a post
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        console.log('Unlike post request for post:', req.params.id);

        const post = await Post.findById(req.params.id);

        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).json({ msg: 'Post not found' });
        }

        //decrement likes
        if (post.likes > 0) {
        post.likes -= 1;
        await post.save();
        }

        console.log(`Post ${req.params.id} unliked, new count: ${post.likes}`);
        res.json(post);
    } catch (err) {
        console.error('Error unliking post:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});
*/
//@route POST /api/posts/comment/:id
//@desc Comment on a post
//@access Private
router.post(
    '/comment/:id',
    [
        auth,
        [
            check('text', 'Comment text is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const post = await Post.findById(req.params.id);

            if (!post) {
                console.log('Post not found:', req.params.id);
                return res.status(404).json({ msg: 'Post not found' });
            }

            //add comment to post
            post.comments.push({
                user: req.user.id,
                text: req.body.text,
                date: new Date(),
            });

            post.comments += 1;

            await post.save();
            console.log('Comment added to post:', req.params.id);
            res.json(post);
        } catch (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({
                msg: 'Server error',
                error: err.message
            });
        }
    }
);
       
export default router;