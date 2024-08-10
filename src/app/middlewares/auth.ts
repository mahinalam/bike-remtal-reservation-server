/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'
import AppError from '../errors/appError'
import httpStatus from 'http-status'
const Auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'You have no access to this route',
      })
    }
    // check if the token is valid
    jwt.verify(
      token as string,
      config.access_token_secret as string,
      async function (err, decoded) {
        if (err) {
          res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'You have no access to this route',
          })
        }
        const userRole = (decoded as JwtPayload).role
        if (requiredRoles && !requiredRoles.includes(userRole)) {
          res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'You have no access to this route',
          })
        }
        const { role, iat, email } = decoded as JwtPayload

        // checking if the user is exist
        const user = await User.findOne({ email })
        if (!user) {
          throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
        }
        // checking if the user is already deleted
        const isDeleted = user?.isDeleted
        if (isDeleted) {
          throw new AppError(httpStatus.FORBIDDEN, 'This User is deleted!')
        }
        req.user = decoded as JwtPayload
        next()
      },
    )
  })
}

export default Auth
