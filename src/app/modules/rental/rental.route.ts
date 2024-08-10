import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { USER_ROLE } from '../user/user.constant'
import Auth from '../../middlewares/auth'
import { RentalController } from './rental.controller'
import { RentalValidationSchema } from './rental.validation'

const router = express.Router()

router.post(
  '/',
  Auth(USER_ROLE.user),
  validateRequest(RentalValidationSchema.createRentalValidationSchema),
  RentalController.createRentalAndUpdateCarStatus,
)
router.get('/', Auth(USER_ROLE.user), RentalController.getAllUserRentals)
router.put(
  '/:id/return',
  Auth(USER_ROLE.admin),
  RentalController.updateReturnBikeInfo,
)

export const RentalRoutes = router
