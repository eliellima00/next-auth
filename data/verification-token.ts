import { db } from "@/lib/db";

export const getVerificationTokenBytoken = async (
  token: string
) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token
      }
    })

    return verificationToken
  } catch {

  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email
      }
    })

    return verificationToken
  } catch {

  }
}