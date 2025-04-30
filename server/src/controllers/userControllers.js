import User from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role, score } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.role = role || user.role;
            if (score !== undefined) user.score = score;
            
            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                score: updatedUser.score
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserScore = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            userId: user._id,
            name: user.name,
            score: user.score,
        });
    } catch (error) {
        console.error('Error fetching user score:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserScore = async (req, res) => {
    try {
        const { score } = req.body;
        const userId = req.user._id;
        
        if (score === undefined) {
            return res.status(400).json({ message: 'Score is required' });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.score = score;
        await user.save();
        
        res.json({
            userId: user._id,
            name: user.name,
            score: user.score
        });
    } catch (error) {
        console.error('Error updating user score:', error);
        res.status(500).json({ message: 'Server error' });
    }
};