import jwt from "jsonwebtoken";

export const generateAccessToken = (phone: string) => {
  return jwt.sign({ phone }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (phone: string) => {
  return jwt.sign({ phone }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
