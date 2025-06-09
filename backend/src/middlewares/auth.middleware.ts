import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.cookies as { accessToken?:string}).accessToken;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { phone : string };
    (req as any).user = { phone: decoded.phone }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const bearerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - Missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { phone: string };
    (req as any).user = { phone: decoded.phone };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const cookieSessionAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.cookies as { accessToken?: string })?.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing cookie token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { phone: string };
    (req as any).user = { phone: decoded.phone };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
