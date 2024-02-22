"use server"

import { RegisterSchema } from '@/schemas'
import * as z from 'zod'

const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  return {
    success: "Email sent"
  }
}

export default register