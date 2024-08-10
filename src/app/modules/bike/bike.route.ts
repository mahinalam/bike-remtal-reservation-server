import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import Auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
import { BikeController } from './bike.controller'
import { BikeValidationSchema } from './bike.validation'

const router = express.Router()
// admin
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5haGlkQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMzE2Nzk5MSwiZXhwIjoxNzI0MDMxOTkxfQ.Tcmy1O81hlHoIjN4NxerndDSza96VlJoGgMVS_fOPh8

// user
//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGluQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIzMTY4MjE3LCJleHAiOjE3MjQwMzIyMTd9.nyeuYWT-eatM5AH0MZggeEsoNtx6SwHAAqQl1jOi_F4

router.post(
  '/',
  Auth(USER_ROLE.admin),
  validateRequest(BikeValidationSchema.createBikeValidationSchema),
  BikeController.createBike,
)
router.get('/', BikeController.getAllBikes)
router.get('/:id', BikeController.getSingleBike)

router.put(
  '/:id',
  Auth(USER_ROLE.admin),
  validateRequest(BikeValidationSchema.updateBikeValidationSchema),
  BikeController.updateBike,
)
router.delete('/:id', Auth(USER_ROLE.admin), BikeController.deleteBike)

export const BikeRoutes = router
