/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'

export interface IRental {
  _id: Types.ObjectId
  userId: Types.ObjectId
  bikeId: Types.ObjectId
  startTime: string
  returnTime: string
  totalCost: number
  isReturned: boolean
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface RentalModel extends Model<IRental> {
  isRentalExists(id: Types.ObjectId | string): Promise<IRental | null>
  isRentalDeleted(): Promise<IRental | null>
}
