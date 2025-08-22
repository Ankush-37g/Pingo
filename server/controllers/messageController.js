import User from "../models/UserModel.js"
import asyncHandler from "../utils/asynHandler.js"
import Message from "../models/MessageModel.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { io, userSocketMap } from "../server.js"

//Getting all the users for chatting in sidebar
const getUsersForSidebar = asyncHandler( async (req, res) => {
 
     const userId = req.user._id

     const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password")

     // count number of messages not seen

     const unseenMessages = {}

     const promises = filteredUsers.map( async (user)=> {

         const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})

         if(messages.length > 0)
         {
            unseenMessages[user._id] = messages.length
         }
     })

     await Promise.all(promises)

     return res.json(new ApiResponse(200, filteredUsers, unseenMessages))


})

//Get all messages for selected user
const getMessages = asyncHandler( async (req, res) => {
    
      const { id: selectedUserId} = req.params

      const myId = req.user._id;

      const messages = await Message.find({
         $or: [
            {senderId: myId, receiverId: selectedUserId},
            {senderId: selectedUserId, receiverId: myId},
            
         ]
      })

      await Message.updateMany({ senderId: selectedUserId, receiverId: myId}, {seen: true})

      return res.json(new ApiResponse(200, messages))
})

// api to mark message as seen using message id
const markMessageAsSeen = asyncHandler( async (req, res)=> {
      
      const { id } = req.params

      await Message.findByIdAndUpdate(id, {seen: true})

      return res.json(new ApiResponse(200));
})

//Send message to selected user
const sendMessage = asyncHandler( async(req, res)=> {
  
     const {text, image} = req.body;
     const receiverId = req.params.id;
     const senderId = req.user._id;

     let imageUrl;

     if(image)
     {
       const uploadResponse = await cloudinary.uploader.upload(image)

       imageUrl = uploadResponse.secure_url;
     }

     const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl
     })

     //Emit the new message to receiver's socket
     const receiverSocketId = userSocketMap(receiverId)

     if(receiverSocketId)
     {
        io.to(receiverSocketId).emit("newMessage", newMessage)
     }

     return res.json(new ApiResponse(200, newMessage ))


})

export {getUsersForSidebar,markMessageAsSeen,sendMessage,getMessages}


