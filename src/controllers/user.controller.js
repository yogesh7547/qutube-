import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.js";
import { ApiResponse } from "../util/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";
// import { deleteFromCloudinary } from "../util/DeleteFromCloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN GENERATION ERROR:", error);
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

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
  // console.log(req.body);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(avatarLocalPath)
  // const coverImageLocalPath= req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access token and refresh token
  // send cookie

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  //alternative method is you can check either one of them
  //if(!(username || email)){
  //throw new ApiError(400, "username or email is required")
  //}

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInuser = await User.findById(user._id).select(
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
          user: loggedInuser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,// this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;

  if(!incomingRefreshToken){
   throw new ApiError(401, "Unauthorized request")
  }
try {
  
    const decodedToken=jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
  
    const user=await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401, "Invalid refreshToken")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "refresh token is expired or used")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
  
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken, refreshToken:newRefreshToken},
        "Access Token refreshed"
      )
    )
} catch (error) {
  throw new ApiError(401,error?.message || "Invalid refreshToken")
}
});

const changeCurrentPassword= asyncHandler(async(req, res)=>{
  const {oldPassword, newPassword}= req.body
  
  const user= await User.findById(req.user?._id)
  const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "invalid old password")
  }

  user.password= newPassword
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"password changed succesfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,"Current user fetched successfully"))
})

const updateAccountDetails= asyncHandler(async(req,res)=>{
  const {fullName, email}=req.body

  if(!fullName || !email){
     throw new ApiError(400, "all fields are required")
  }

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
       $set:{
        fullName,
        email,
       }
    },
    {new:true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200,user,"Account details updated successfully"))
})

const updateUserAvatar= asyncHandler(async(req,res)=>{
  const avatarLocalpath= req.file?.path
  // console.log(avatarLocalpath)

  if(!avatarLocalpath){
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar= await uploadOnCloudinary(avatarLocalpath)

  if(!avatar.url){
    throw new ApiError(400,"Error while uploading on avatar")
  }

  const previousUser= await User.findById(req.user._id);
  const previousAvatarUrl=previousUser?.avatar.url;

  

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      set:{
        avatar:avatar.url
      },
     
    },
    {new:true}
  ).select("-password")



  if(previousAvatarUrl){
   
      const urlParts=previousAvatarUrl?.split("/")
      const publicIdWithExtension = urlParts[urlParts?.length - 1];
      const publicId = publicIdWithExtension?.split('.')[0];

      if(publicId){
        
        try {
           const resultOfDeletion=await deleteFromCloudinary(publicId);
        } catch (error) {
          console.log("failed to delete old avatar file ")
        }
       
      }
    
  }

  
 
  return res
  .status(200)
  .json(new ApiResponse(200,user,"Avatar file updated successfully"))

  

})

const updateUserCoverImage= asyncHandler(async(req,res)=>{
  const coverImageLocalpath= req.file?.path

  if(!coverImageLocalpath){
    throw new ApiError(400, "coverImage file is missing")
  }


  const coverImage= await uploadOnCloudinary(coverImageLocalpath)

  if(!coverImage.url){
    throw new ApiError(400,"Error while uploading on coverImage")
  }

  const previousUser= await User.findById(req.user._id);
  const previousCoverImageUrl= previousUser?.coverImage.url

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      set:{
        coverImage:coverImage.url
      },
     
    },
    {new:true}
  ).select("-password")

  if(previousCoverImageUrl){
    const urlParts=previousCoverImageUrl?.split("/")
    const publicIdWithExtension = urlParts[urlParts?.length - 1];
    const publicId=publicIdWithExtension?.split(".")[0]

    try {
       const resultOfDeletion= await deleteFromCloudinary(publicId);
    } catch (error) {
      console.log("failed to delete previos cover-image")
    }
  }
 
  return res
  .status(200)
  .json(new ApiResponse(200,user,"coverImage file updated successfully"))


})

const getUserChannelProfile= asyncHandler(async(req,res)=>{
  const {username}= req.params

  if(!username?.trim()){
    throw new ApiError(400, "username is missing")
  }

  const channel= await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{
          $size:"$subscribers"
        },
        channelsSubscribedToCount:{
          $size:"$subscribedTo"
        },
        isSubscribed:{
          $cond:{
            if:{$in: [req.user?._id,"$subscribers.subscriber"]},
            then:true,
            else:false
          }
        }
      }
    },
    {
      $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1,
      }
    }
  ])

  if(!channel?.length){
    throw new ApiError(404, "Channel does not exist")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, channel[0],"User Channel fetched successfully")
  )

  // console.log(channel)
})

const getWatchHistory=asyncHandler(async (req,res)=>{
  const user= await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
         from:"videos",
         localField:"watchHistory",
         foreignField:"_id",
         as:"watchHistory",
         pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
         ]
      }
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      user[0].watchHistory,
      "watch History fetched successfully"
    )
  )
})

export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
};


