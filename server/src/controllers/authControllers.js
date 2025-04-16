import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res)=>{
    const {name, email, phone, password} = req.body;

    try {
        const userExists = await User.findOne({phone: phone});

        if (userExists) {
            return res.status(400).json({message: 'User already exists'});
        }
        let hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, phone, hashedPassword})

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async (req, res)=>{
    const {phone, password} = req.body;

    try {
        const user = await User.findOne({phone})

        if(user && (await user.compare(password, 10))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid Phone number or Password' });
        }

    } catch (error){
        res.status(500).json({ message: 'Server error' });
    }
}

export const forgotPassword = async (req, res) => {
    const { phone } = req.body;
    
    try {
        const user = await User.findOne({ phone });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found with this phone number' });
        }
        res.json({ 
            message: 'Reset code sent successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};