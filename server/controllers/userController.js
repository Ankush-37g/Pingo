import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asynHandler.js";
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiResponse } from "../utils/ApiResponse.js";

const generateToken = (userId) => {
    
    const token = jwt.sign({userId},process.env.JWT_SECRET)

    return token;
    
}

const signup = asyncHandler( async (req, res)=> {
      
    const {fullName, email, password, bio} = req.body;

    if(!fullName || !email || !password || !bio)
    {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({email})

    if(user)
    {
        throw new ApiError(409, "User already exist")
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = User.create({
        fullName, email, password: hashedPassword, bio
    })

    const token = generateToken(user._id)

    return res.json(new ApiResponse(200,newUser,token,"Account created successfully"))
})

const login = asyncHandler( async (req,res) => {
     
     const {email, password} = req.body;

     const userData = await User.findOne({email})

     if(!userData)
     {
        throw new ApiError(400,"User does not exist")
     }

     const isValidPassword = await userData.isPasswordCorrect(password)

     if(!isValidPassword)
     {
        throw new ApiError(400, "Invalid credentials")
     }

     const token = generateToken(userData._id)

     return res.json(new ApiResponse(200,userData,token,"Login Successful"))

     

})

const updateProfile = asyncHandler( async (req, res) =>{

     const { profilePic, bio, fullName } = req.body;

     const userId = req.user._id;

     let updatedUser;

     if(!profilePic){
        updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
     }
     else{
        const upload = await cloudinary.uploader.upload(profilePic);

        updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName }, {new: true})
     }
})

export {signup,login}