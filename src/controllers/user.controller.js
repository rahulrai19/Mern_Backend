import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend 
    // validation - not empty
    // check if user already exists : username and email 
    // check for images, check for avatar 
 // upload them to cloudinary 
 // create user object - create entry in db 
 // remove password and refresh token field from response
 // check for user creation 
 // return res
 /*
 Extract required fields from request body 
 */
 const {fullName,email,username,password}=req.body
console.log("email: ",email);

/* basic method for begginers everytime using if-else
 if(fullName===""){
    throw new ApiError(400,"fullName is required")
 }
    */

// array methods

/*
Validate required field
*/
if(
    [fullName,email,username,password].some((field)=>
        field?.trim()==="")

){
    throw new ApiError(400,"All fields are required")
}
/* 
Check existed user using unique username and email
*/
 
const existedUser = User.findOne({
    $or:[{ username },{ email }]
})
if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
}

/*
Extract local file paths from multer uploads
*/

const avatarLocalPath = req.files?.avatar[0]?.path;

const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
}

/*
uploads files to cloudinary 
*/

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
 
if(!avatar){
    throw new ApiError(400,"Avatar file is required")
 }

 /*
 create user object in the databse
 */
const user =  await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase()
 })
 /* remove sensitive fields before sending response
 */
 const createdUser = await User.findById(user._id).select(
     "-password -refreshToken"
 )
if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}
/* return succesful api response

*/
return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered successfully.")

)
})

export {registerUser} 