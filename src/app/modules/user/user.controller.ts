import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { UserServices } from './user.service'

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body
  const result = await UserServices.createUserIntoDB(user)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  })
})
const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const loggedUser = req.body
  const result = await UserServices.loginUserIntoDB(loggedUser)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    token: result.accessToken,
    message: 'User logged in successfully',
    data: result.result,
  })
})
const getMe: RequestHandler = catchAsync(async (req, res) => {
  const { email, role } = req.user
  const result = await UserServices.getMeFromDB(email, role)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: result,
  })
})
const updateGetMe: RequestHandler = catchAsync(async (req, res) => {
  const { email, role } = req.user
  const payload = req.body
  const result = await UserServices.updateGetMeIntoDB(email, role, payload)
  sendResponse(res, {
    statusCodeNumber: httpStatus.OK,
    success: true,
    statusCode: 200,
    message: 'Profile updated successfully',
    data: result,
  })
})

export const UserController = {
  createUser,
  loginUser,
  getMe,
  updateGetMe,
}
