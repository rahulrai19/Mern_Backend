import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

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
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  /* basic method for begginers everytime using if-else
 if(fullName===""){
    throw new ApiError(400,"fullName is required")
 }
    */

  // array methods

  /*
Validate required field
*/
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  /* 
Check existed user using unique username and email
*/

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // console.log(req.files)
  /*
Extract local file paths from multer uploads
*/

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  /*
uploads files to cloudinary 
*/

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  /*
 create user object in the databse
 */
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  /* remove sensitive fields before sending response
   */
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  /* return succesful api response
   */
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body-> data
  // username or email
  // find the user | user not found
  // password check  | password wrong
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body;

  if ((!username && !email) || !password) {
    throw new ApiError(400, "username or email and password are required");
  }

  // Build query conditionally based on what's provided
  const queryConditions = [];
  if (username) {
    queryConditions.push({ username: username.toLowerCase() });
  }
  if (email) {
    queryConditions.push({ email: email.toLowerCase() });
  }

  const user = await User.findOne({
    $or: queryConditions,
  });

  if (!user) {
    throw new ApiError(404, "User not found !");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  // i added refresh token in methods

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  ); // passed for id form user

  const loggedInUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,{
      $unset: {
        refreshToken:1
      }
    },
    {
      new:true
    }
   )
   const options = {
    httpOnly:true,
    secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.
  refreshToken || req.body.refreshToken

  if(incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }
  const decodedToken=jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

   const user = await User.findById(decodedToken?._id)
  

})

export { registerUser, loginUser,logoutUser };
