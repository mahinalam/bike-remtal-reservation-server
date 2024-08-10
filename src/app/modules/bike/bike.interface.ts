/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'

export interface IBike {
  _id: Types.ObjectId
  name: string
  description: string
  isAvailable: boolean
  cc: number
  year: number
  model: string
  brand: string
  pricePerHour: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BikeModel extends Model<IBike> {
  isBikeExists(id: Types.ObjectId | string): Promise<IBike | null>
  isBikeDeleted(): Promise<IBike | null>
}
