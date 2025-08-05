import express from 'express'
import { signup, login , updateProfile} from '../controllers/userController'
import { protectRoute } from '../middleware/authMiddleware'

const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile",protectRoute, updateProfile)

export default userRouter;
