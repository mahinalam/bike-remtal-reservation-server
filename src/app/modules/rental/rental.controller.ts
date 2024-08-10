import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { RentalService } from './rental.service'

// create rental
const createRentalAndUpdateCarStatus: RequestHandler = catchAsync(
  async (req, res) => {
    const rental = req.body
    const user = req.user.email
    const result = await RentalService.createRentalAndUpdateBikeStatusIntoDB(
      user,
      rental,
    )
    sendResponse(res, {
      statusCodeNumber: httpStatus.OK,
      success: true,
      statusCode: 200,
      message: 'Rental created  successfully',
      data: result,
    })
  },
)

// get all users rentals
const getAllUserRentals: RequestHandler = catchAsync(async (req, res) => {
  const email = req.user?.email
  const result = await RentalService.getAllUserRentalsFromDB(email)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Rentals retrieved successfully',
    data: result,
  })
})

const updateReturnBikeInfo: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await RentalService.updateReturnBikeInfoIntoDB(id)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bike returned successfully',
    data: result,
  })
})

export const RentalController = {
  createRentalAndUpdateCarStatus,
  getAllUserRentals,
  updateReturnBikeInfo,
}
