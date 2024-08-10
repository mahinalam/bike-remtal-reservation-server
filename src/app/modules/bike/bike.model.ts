import { Schema, model } from 'mongoose'
import { BikeModel, IBike } from './bike.interface'

const bikeSchema = new Schema<IBike>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cc: {
      type: Number,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      trim: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      trim: true,
      default: false,
    },
  },
  { timestamps: true },
)

// query middleware
bikeSchema.pre('find', function (next) {
  this.where({ isDeleted: false })
  next()
})

// check if the bike exists
bikeSchema.statics.isBikeExists = async function (
  id: string,
): Promise<IBike | null> {
  const isBikeExists = await Bike.findById(id)
  return isBikeExists
}

export const Bike = model<IBike, BikeModel>('Bike', bikeSchema)
