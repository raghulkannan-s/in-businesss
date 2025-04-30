import jwt from "jsonwebtoken"

const generateToken = (user) => {
    return jwt.sign({
        _id : user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role : user.role,
        score: user.score
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    })
}

export default generateToken