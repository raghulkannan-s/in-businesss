import jwt from 'jsonwebtoken';

export const tokenVerify = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).send("Unauthorized: No token provided");
        return;
    }
    if(!process.env.JWT_SECRET){
        res.status(500).send("Internal Server Error: JWT secret not configured. Contact the administrator.");
        console.error("JWT secret is not defined in environment variables.");
        return;
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).send("Unauthorized: Invalid token");
    }
}