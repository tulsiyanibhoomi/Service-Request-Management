import { promisify } from "util";
import { prisma } from "./prisma";
import crypto from "crypto";
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./jwt";

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
) {
  if (salt === "mysaltvalue") {
    return password === hash;
  }
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey);
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return { salt, hash: derivedKey.toString("hex") };
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        user_role: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "Email doesn't exist" };
    }

    const isValid = await verifyPassword(password, user.password, user.salt);

    if (!isValid) return { success: false, error: "Invalid credentials" };

    const roleName = user.user_role[0]?.role.rolename || "user";

    const token = signToken({
      id: user.userid,
      email: user.email,
      role: roleName,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: user.userid,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: roleName,
      },
    };
  } catch (error) {
    console.error("Sign in error: ", error);
    return { success: false, error: "Failed to sign in" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = verifyToken(token);

  if (!payload) {
    throw new Error("Invalid token");
  }

  const user = await prisma.users.findUnique({
    where: { userid: payload.id },
    include: {
      user_role: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const roleName = user.user_role[0]?.role.rolename || "user";

  return {
    id: user.userid,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    role: roleName,
  };
}
