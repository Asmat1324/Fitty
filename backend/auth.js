//backend/routes/auth.js



import express from 'express';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import User from './user.js';





const router = express.Router();



//@route POST /register

//@desc Register a new user

//@access Public

router.post('/register', async (req, res) => {

    const { username, email, password } = req.body;



    try {

        let user = await User.findOne({ username });

        if (user) return res.status(400).json({ msg: 'Username already exists' });



        user = new User({

            username,

            email,

            password,

        });



        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);



        await user.save();



        const payload = {

            user: {

                id: user._id

            }

        };



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

        }else if (email) {

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



        jwt.sign(

            payload,

            process.env.JWT_SECRET,

            { expiresIn: 360000 },

            (err, token) => {

                if (err) throw err;

                res.json({ token });

            }

        );

    }catch (err) {

        console.error(err.message);

        res.status(500).send('Server Error');

    }

});



export default router;