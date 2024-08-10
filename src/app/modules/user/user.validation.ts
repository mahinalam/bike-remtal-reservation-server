import z from 'zod'
import { userRole } from './user.constant'
const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email()
      .trim(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6)
      .trim(),
    phone: z
      .string({
        required_error: 'Phone is required',
      })
      .trim(),
    role: z.enum(userRole as [string, ...string[]]),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .trim(),
    isDeleted: z.boolean().optional(),
  }),
})

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    password: z.string().trim(),
  }),
})

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .optional(),
    address: z.string().min(1, 'Address is required').optional(),
  }),
})

export const UserValidationSchema = {
  createUserValidationSchema,
  loginValidationSchema,
  updateProfileValidationSchema,
}
