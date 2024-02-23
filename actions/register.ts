"use server"

import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'
import { hash } from "bcryptjs"
import * as z from 'zod'

const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await hash(password, 10)
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {
      error: "Email already in user!"
    }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  //TODO: Send verification token email

  return {
    success: "Email sent"
  }
}

export default register