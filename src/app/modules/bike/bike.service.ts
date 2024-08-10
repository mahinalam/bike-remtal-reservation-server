/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/appError'
import { Bike } from './bike.model'
import { IBike } from './bike.interface'

const createBikeIntoDB = async (payload: IBike) => {
  // check if the bike exists
  const bike = await Bike.findOne({ name: payload?.name })
  if (bike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike already exists')
  }
  const result = await Bike.create(payload)
  return result
}

// get single bike
const getSingleBikeFromDB = async (id: string) => {
  const isBikeExists = await Bike.findById(id)
  if (!isBikeExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike not found!')
  }
  const isDeletedBike = isBikeExists.isDeleted
  if (isDeletedBike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike already deleted!')
  }
  return isBikeExists
}

// get all bikes
const getAllBikesFromDB = async () => {
  const isBikesExists = await Bike.find()
  if (isBikesExists.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bikes not found!')
  }
  return isBikesExists
}

const updateBikeIntoDB = async (id: string, payload: Partial<IBike>) => {
  // check if the bike exists
  const bike = await Bike.isBikeExists(id)
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!')
  }
  const isDeletedBike = bike?.isDeleted
  if (isDeletedBike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike already deleted!')
  }

  //   Update the bike document
  const updatedBike = await Bike.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return updatedBike
}

// delete bike(softDelete) from db
const deleteBikeFromDB = async (id: string) => {
  const bike = await Bike.isBikeExists(id)
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!')
  }
  const isDeletedBike = bike.isDeleted
  if (isDeletedBike) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike already deleted!')
  }

  const result = await Bike.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

export const BikeServices = {
  createBikeIntoDB,
  getSingleBikeFromDB,
  getAllBikesFromDB,
  updateBikeIntoDB,
  deleteBikeFromDB,
}
