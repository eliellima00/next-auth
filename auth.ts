import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { db } from "./lib/db"

type Role = "ADMIN" | "USER"

declare module "next-auth" {
  interface User {
    role: Role
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string)

      if (!existingUser?.emailVerified) return false

      // TODO: Add 2FA check

      return true
    }
    ,
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.role = token.role as Role
      }
      return session
    },
    async jwt({
      token
    }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})