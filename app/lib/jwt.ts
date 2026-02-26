import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  return verifyToken(token);
}
