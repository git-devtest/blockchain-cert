import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ override: false });

const JWT_SECRET = process.env.JWT_SECRET || "blockchain_cert_secret_2026";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "8h";

export const generarToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions);
};

export const verificarToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
