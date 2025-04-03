//backend/post.js
import express from 'express';
import Post from '../models/post.js';
import auth from '../middleware.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// @route POST /api/posts
// @desc Create a new post
// @access Private (requires authentication)
router.post(
    '/',
    [
        auth,
        [
            check('imageUri', 'Image is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newPost = new Post({
                user: req.user.id,
                imageUri,
                caption,
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//@route GET /api/posts
//@desc Get all posts, sorted by newest first, with user infor
// @access Private (users need to be logged in to see the feed)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date_created: -1 }).populate('user', ['username']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route DELETE /api/posts/:id
//@desc Delete a post
//@access Private (only the user who created the post can delete it)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

export default router;