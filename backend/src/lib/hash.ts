import bcrypt from "bcryptjs";

export const hashToken = async (token: string) => {
  return await bcrypt.hash(token, 10);
};

export const compareToken = async (token: string, hashed: string) => {
  return await bcrypt.compare(token, hashed);
};

