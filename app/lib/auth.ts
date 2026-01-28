import { promisify } from "util"
import { prisma } from "./prisma"
import crypto from "crypto"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"

// export async function signUp(email: string, password: string) {
//   try {
//     const existingUser = await db.user.findUnique({ where: { email } })
//     if (existingUser) return { success: false, error: "User already exists" }

//     const { salt, hash } = await hashPassword(password)

//     const userCount = await db.user.count()
//     const role = userCount === 0 ? "admin" : "user"

//     const user = await db.user.create({
//       data: {
//         email,
//         password: hash,
//         salt,
//         role,
//       },
//     })

//     return { success: true, user }
//   } catch (error) {
//     console.error("Sign up error: ", error)
//     return { success: false, error: "Failed to create user" }
//   }
// }

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
        })

        if (!user) {
            return { success: false, error: "Invalid credentials" }
        }

        const isValid = await verifyPassword(password, user.password, user.salt)

        if (!isValid) return { success: false, error: "Invalid credentials" }

        const roleName = user.user_role[0]?.role.rolename

        return {
            success: true,
            user: {
                id: user.userid,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                role: roleName,
            },
        }

    } catch (error) {
        console.error("Sign in error: ", error)
        return { success: false, error: "Failed to sign in" }
    }
}

const scryptAsync = promisify(crypto.scrypt)
const KEY_LENGTH = 64

export async function verifyPassword(
    password: string,
    hash: string,
    salt: string
) {
    if (salt === "mysaltvalue") {
        return password === hash
    }
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey)
}

export async function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex")
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
    return { salt, hash: derivedKey.toString("hex") }
}

export type SessionData = {
    id?: number
    email?: string
    fullname?: string
    username?: string
    role?: string
    isLoggedIn: boolean
}

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "auth-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    },
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

    if (!session.isLoggedIn) {
        session.isLoggedIn = false
    }

    return session
}

export async function logout() {
    const session = await getSession()
    session.destroy()
}

export async function getCurrentUser() {
    const session: SessionData = await getSession();

    if (!session.isLoggedIn || !session.id) {
        throw new Error("Unauthorized");
    }

    return {
        userid: session.id,
        email: session.email,
        fullname: session.fullname,
        username: session.username,
        role: session.role,
    };
}