import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { BikeServices } from './bike.service'

// create bike
const createBike: RequestHandler = catchAsync(async (req, res) => {
  const bike = req.body

  const result = await BikeServices.createBikeIntoDB(bike)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bike added successfully',
    data: result,
  })
})

// get single bike
const getSingleBike: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await BikeServices.getSingleBikeFromDB(id)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bike retrieved successfully',
    data: result,
  })
})
// get all bikes
const getAllBikes: RequestHandler = catchAsync(async (req, res) => {
  const result = await BikeServices.getAllBikesFromDB()
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bikes retrieved successfully',
    data: result,
  })
})

// update bike
const updateBike: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body

  const result = await BikeServices.updateBikeIntoDB(id, payload)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bike updated successfully',
    data: result,
  })
})

// delete bike
const deleteBike: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await BikeServices.deleteBikeFromDB(id)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Bike deleted successfully',
    data: result,
  })
})

export const BikeController = {
  createBike,
  getSingleBike,
  getAllBikes,
  updateBike,
  deleteBike,
}
