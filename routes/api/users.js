// imports
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// get my User model
const User = require('../../models/User');

// init router
const router = express.Router();

// @route   POST api/users
// @desc    Register user with express-validator validation
// @access  Public
router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], 
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{msg: 'User already exists' }] });
        }
        // Get user's gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrpy password w/ bcrypt
        const salt = await bcrpt.genSalt(10);
        user.password = await bcrpt.hash(password, salt);
        await user.save();

        // return JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtsecret'), 
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }   
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// exports
module.exports = router;