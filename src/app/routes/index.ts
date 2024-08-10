import { Router } from 'express'
import { authRoutes } from '../modules/user/auth.route'
import { BikeRoutes } from '../modules/bike/bike.route'
import { RentalRoutes } from '../modules/rental/rental.route'
import { userRoutes } from '../modules/user/user.route'
const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    element: authRoutes,
  },
  {
    path: '/users',
    element: userRoutes,
  },
  {
    path: '/bikes',
    element: BikeRoutes,
  },
  {
    path: '/rentals',
    element: RentalRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.element))

export default router
