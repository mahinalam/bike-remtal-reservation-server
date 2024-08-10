import { Schema, model } from 'mongoose'
import { IRental, RentalModel } from './rental.interface'

const rentalSchema = new Schema<IRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'User',
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'Bike',
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    returnTime: {
      type: String,
      trim: true,
      default: null,
    },
    totalCost: {
      type: Number,
      trim: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      trim: true,
      default: false,
    },
    isReturned: {
      type: Boolean,
      trim: true,
      default: false,
    },
  },
  { timestamps: true },
)

// query middleware
rentalSchema.pre('find', function (next) {
  this.where({ isDeleted: false })
  next()
})

// check if the rental exists
rentalSchema.statics.isRentalExists = async function (
  id: string,
): Promise<IRental | null> {
  const isRentalExists = await Rental.findById(id)
  return isRentalExists
}

export const Rental = model<IRental, RentalModel>('Rental', rentalSchema)
