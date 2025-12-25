import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    profilePic: {type: String, default: ""},
    bio: {type: String},
},{timestamps: true})

userSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password,this.password)
}

const User = mongoose.models.User || mongoose.model("User",userSchema) 


export default User