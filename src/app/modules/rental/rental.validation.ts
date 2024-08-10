import { z } from 'zod'

// Zod schema for Booking
// const createBookingValidationSchema = z.object({
//   body: z.object({
//     car: z.string().length(24, 'Invalid car ID format'),
//     date: z.string().refine((val) => !isNaN(Date.parse(val)), {
//       message: 'Invalid date format',
//     }),
//     startTime: z
//       .string()
//       .refine((val) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(val), {
//         message: 'Invalid time format, must be HH:MM in 24-hour format',
//       }),
//   }),
// })

const createRentalValidationSchema = z.object({
  body: z.object({
    bikeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
    startTime: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  }),
})

export const RentalValidationSchema = {
  createRentalValidationSchema,
  // updateRentalValidationSchema,
}
