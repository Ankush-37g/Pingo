import User from '../models/User.js'
import asyncHandler from '../utils/asynHandler.js'
import ApiError from '../utils/ApiError.js'

export const protectRoute = asyncHandler( async (req, res, next)=> {

    const token = req.headers("Authorization")?.replace("Bearer ","")

    if(!token)
    {
        throw new ApiError(401,"Unauthorized Access")
    }

    const decoded_token = jwt.verify(token,process.env.JWT_sECRET)

    const user = await User.findById(decoded_token.userId).select("-password")

    if(!user) 
         throw new ApiError(400, "User not found")

    req.user = user

    next()
    

}) 