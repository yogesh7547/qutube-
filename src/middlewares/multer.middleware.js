import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});

//multer.diskStorage() lets you specify how and where files should be saved on the disk.

//cb(null, "./public/temp") to set the upload folder as ./public/temp on your server where files will be stored temporarily.
// The first argument null means "no error," and the second argument is the folder path.

//originalname is a built-in Multer property that stores the original name of the file on the user's computer as it was before uploading.