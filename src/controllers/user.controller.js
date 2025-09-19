import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../util/cloudinary.js'
import { ApiResponse } from "../util/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation- not empty
  //check if user already exist:username, email
  //check for images, check for avatars
  //upload them to cloudinary, avatar
  //create user object- create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath= req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400, "avatar file is required");
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400, "avatar file is required");
}

const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "something went wrong while registering the user")
}


return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
)




});





export { registerUser };




//.select("-password -refreshToken"):
// This part excludes the password and refreshToken fields from the resulting document.
// The minus sign (-) before the field names means "exclude these fields.

// req.files is an object provided by file-upload middleware (such as multer or express-fileupload) in Express.js. It contains the files uploaded from the client, grouped by input field names.