import { v2 as cloudinary } from "cloudinary";




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const options = {
  resource_type: 'auto',
  invalidate: true 
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result= await cloudinary.v2.uploader
      .destroy(publicId,options)
      .then(result=>console.log(result))

      return result;
      
  } catch (error) {
    console.log("unsuccessful deletion", error)
    return null;
  }
};

export { deleteFromCloudinary };
