import { z } from 'zod'

const createBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    cc: z.number().int().positive('Engine capacity must be a positive integer'),
    year: z
      .number()
      .int()
      .gte(1886, 'Year must be a valid year')
      .lte(new Date().getFullYear(), 'Year cannot be in the future'),
    model: z.string().min(1, 'Model is required'),
    brand: z.string().min(1, 'Brand is required'),
    pricePerHour: z
      .number()
      .positive('Price per hour must be a positive number'),
    isAvailable: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
})

const updateBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    cc: z
      .number()
      .int()
      .positive('Engine capacity must be a positive integer')
      .optional(),
    year: z
      .number()
      .int()
      .gte(1886, 'Year must be a valid year')
      .lte(new Date().getFullYear(), 'Year cannot be in the future')
      .optional(),
    model: z.string().min(1, 'Model is required').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    pricePerHour: z
      .number()
      .positive('Price per hour must be a positive number')
      .optional(),
    isAvailable: z.boolean().optional().optional(),
    isDeleted: z.boolean().optional().optional(),
  }),
})
const returnCarValidationSchema = z.object({
  body: z.object({
    bookingId: z.string().length(24, 'Invalid booking ID'),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'), // Validates time in HH:mm format
  }),
})
export const BikeValidationSchema = {
  createBikeValidationSchema,
  updateBikeValidationSchema,
  returnCarValidationSchema,
}
