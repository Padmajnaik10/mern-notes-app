import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST /api/auth/register 

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
        });
        const token = generateToken(user._id);
        res.status(201).json({id: user._id, username: user.username, email: user.email, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        res.json({ id: user._id, username: user.username, email: user.email, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }   
});

//me
router.get("/me", protect, (req, res) => {
    res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}


export default router;