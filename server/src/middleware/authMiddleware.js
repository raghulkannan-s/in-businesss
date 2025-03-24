import jwt, { verify } from "jsonwebtoken"

import User from "../models/userModel.js"

const authMiddleware = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
        token = req.headers.authorization.split(" ")[1]; // 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is invalid or expired" });
    }
    } else {
    res.status(401).json({ message: "No token, authorization denied" });
    }
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};


export default { verifyToken, authMiddleware };