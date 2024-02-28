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

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
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