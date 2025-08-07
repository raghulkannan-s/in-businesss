import jwt from "jsonwebtoken";


export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};
