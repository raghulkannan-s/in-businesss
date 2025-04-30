import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res)=>{
    const {name, email, phone, password, role = "user"} = req.body;

    try {
        const userExists = await User.findOne({phone: phone});

        if (userExists) {
            return res.status(400).json({message: 'User already exists'});
        }
        let hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, 
            email, 
            phone, 
            password: hashedPassword,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                score: user.score,
                token: generateToken(user)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res)=>{
    const {phone, password} = req.body;

    try {
        const user = await User.findOne({phone});

        if(user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                score: user.score,
                token: generateToken(user)
            });
        } else {
            res.status(400).json({ message: 'Invalid Phone number or Password' });
        }

    } catch (error){
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};