// imports
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrpt = require('bcryptjs');

// get my User model
const User = require('../../models/User');

// init router
const router = express.Router();

// @route   POST api/users
// @desc    Register user with express-validator validation
// @access  Public
router.post('/', [
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
        res.send('User registered');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// exports
module.exports = router;