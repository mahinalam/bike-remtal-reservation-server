/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import AppError from '../../errors/appError'
import mongoose, { Document } from 'mongoose'
import { IRental } from './rental.interface'
import { User } from '../user/user.model'
import { Bike } from '../bike/bike.model'
import { Rental } from './rental.model'
import { Types } from 'mongoose'
import { format } from 'date-fns'

// create rental
const createRentalAndUpdateBikeStatusIntoDB = async (
  email: string,
  payload: IRental,
) => {
  const { bikeId, startTime } = payload
  const user = await User.findOne({ email })

  const bikeInfo = await Bike.isBikeExists(bikeId)
  if (!bikeInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!')
  }

  const updatedRental = {
    userId: user!._id,
    bikeId: bikeInfo._id,
    startTime,
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // update bike status (transaction-1)
    const updatedBike = await Bike.findByIdAndUpdate(
      bikeInfo._id,
      { isAvailable: false },
      { new: true, session },
    )
    if (!updatedBike) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to upadte Bike status')
    }

    // create a rental (transaction-2)
    const result = await (
      await (await Rental.create(updatedRental)).populate('bikeId')
    ).populate('userId')
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Rental')
    }

    await session.commitTransaction()
    await session.endSession()

    return result
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getAllUserRentalsFromDB = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }
  const isUserDeleted = user?.isDeleted
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already deleted!')
  }
  const userId = user._id
  const result = await Rental.find({ userId })
    .populate('userId')
    .populate('bikeId')
  if (Object.entries(result).length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No User's Rentals found!")
  }
  return result
}

const updateReturnBikeInfoIntoDB = async (
  rentalId: string | Types.ObjectId,
) => {
  // const { bookingId, endTime } = payload
  // check if the booking exists
  const rental = await Rental.isRentalExists(rentalId)

  const rentalDocument = rental as Document & IRental
  //
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!')
  }

  const isDeletedRental = rental?.isDeleted
  if (isDeletedRental) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Rental already deleted!')
  }

  // Combine the rental date with the startTime and endTime to create full Date objects
  const startDateTime = rental.startTime
  const endDateTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")

  // Validate that endDateTime is greater than startDateTime
  if (endDateTime <= startDateTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'End time must be greater than start time',
    )
  }

  // check if the bike exists
  const bike = await Bike.isBikeExists(rental.bikeId)
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!')
  }

  // Convert date strings to Date objects
  const startDate = new Date(startDateTime)
  const endDate = new Date(endDateTime)

  // Now you can call getTime() on the Date objects
  const startTimeInMillis = startDate.getTime()
  const endTimeInMillis = endDate.getTime()

  // Calculate the difference in milliseconds
  const differenceInMs = endTimeInMillis - startTimeInMillis

  // Convert the difference to hours
  const differenceInHours = differenceInMs / (1000 * 60 * 60)
  const formattedDifferenceInHours = differenceInHours.toFixed(2)
  // calculate total cost
  const totalCost =
    Number(formattedDifferenceInHours) * Number(bike.pricePerHour)

  const updatedRentalData = {
    ...rentalDocument.toObject(), // Convert the booking document to a plain object
    startTime: rental.startTime,
    returnTime: endDateTime,
    totalCost: totalCost,
  }

  // Optionally, delete properties that shouldn't be updated or are immutable
  delete updatedRentalData._id
  delete updatedRentalData.__v
  delete updatedRentalData.createdAt
  delete updatedRentalData.updatedAt

  // transaction
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // update bike status (transaction-1)
    const updatedBike = await Bike.findByIdAndUpdate(
      bike._id,
      { isAvailable: true },
      { new: true, session },
    )
    if (!updatedBike) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to upadte Bike status')
    }

    // update booking info (transaction-1)
    const updatedRental = await Rental.findByIdAndUpdate(
      rentalId,
      updatedRentalData,
      { new: true, session },
    )
      .populate('userId')
      .populate('bikeId')
    if (!updatedRental) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Rental Info')
    }
    // console.log('updatedBooking', updatedBooking)

    await session.commitTransaction()
    await session.endSession()

    return updatedRental
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const RentalService = {
  createRentalAndUpdateBikeStatusIntoDB,
  getAllUserRentalsFromDB,
  updateReturnBikeInfoIntoDB,
}
