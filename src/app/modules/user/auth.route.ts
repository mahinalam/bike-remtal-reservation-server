import express from 'express'
import { UserValidationSchema } from './user.validation'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from './user.controller'

const router = express.Router()

//User Token
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGluQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIzMjYxMDIxLCJleHAiOjE3MjQxMjUwMjF9.06RQudI05T1I5b68HI-dwxqDZtWNpsxxWR8-_DlNYvo

// Admin Token
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWlyQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMzI2MTMzOSwiZXhwIjoxNzI0MTI1MzM5fQ.xmq9-Z1u7uKZ271dTg5C3yqWgzY4sb-Qd0WMa-KJfcw

router.post(
  '/signup',
  validateRequest(UserValidationSchema.createUserValidationSchema),
  UserController.createUser,
)
router.post(
  '/login',
  validateRequest(UserValidationSchema.loginValidationSchema),
  UserController.loginUser,
)

export const authRoutes = router
