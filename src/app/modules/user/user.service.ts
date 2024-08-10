import httpStatus from 'http-status'
import AppError from '../../errors/appError'
import { ILoginUser, IUser } from './user.interface'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { User } from './user.model'

const createUserIntoDB = async (payload: IUser) => {
  // checkn if the user alreday exists
  const user = await User.isUserExists(payload?.email)
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User alreday exists')
  }
  await User.create(payload)
  const result = await User.findOne({ email: payload?.email })
  return result
}

const loginUserIntoDB = async (payload: ILoginUser) => {
  const user = await User.isUserExists(payload?.email as string)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is not found!')
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This User is deleted!')
  }
  const filterUser = await User.findOne({ email: payload.email }).select(
    'password',
  )
  if (filterUser) {
    const userPassword = filterUser.password

    // matched email and password
    if (!(await User.isPasswordMatched(payload?.password, userPassword))) {
      throw new AppError(httpStatus.FORBIDDEN, 'password do not matched!')
    }
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  }

  const accessToken = jwt.sign(
    jwtPayload,
    config.access_token_secret as string,
    {
      expiresIn: '10d',
    },
  )

  const result = await User.findOne({ email: payload.email })
  return { result, accessToken }
}

const getMeFromDB = async (email: string, role: string) => {
  let result = null
  if (role === 'user') {
    result = await User.findOne({ email })
  }
  if (role === 'admin') {
    result = await User.findOne({ email })
  }
  return result
}
const updateGetMeIntoDB = async (
  email: string,
  role: string,
  payload: Partial<IUser>,
) => {
  let result = null
  if (role === 'user') {
    result = await User.findOneAndUpdate({ email }, payload, { new: true })
  }
  if (role === 'admin') {
    result = await User.findOneAndUpdate({ email }, payload, { new: true })
  }
  return result
}

export const UserServices = {
  createUserIntoDB,
  loginUserIntoDB,
  getMeFromDB,
  updateGetMeIntoDB,
}
