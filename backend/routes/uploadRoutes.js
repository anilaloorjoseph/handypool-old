import path from "path";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    switch (req.route.path) {
      case "/profile": {
        if (file.fieldname === "customerImage") {
          if (
            !fs.existsSync(
              `./uploads/customer/${req.customer._id}/customerimage`
            )
          ) {
            fs.mkdirSync(
              `./uploads/customer/${req.customer._id}/customerimage`,
              { recursive: true }
            );
          }
          cb(null, `uploads/customer/${req.customer._id}/customerimage`);
        }
        if (file.fieldname === "workerImage") {
          if (
            !fs.existsSync(`./uploads/worker/${req.worker._id}/workerimage`)
          ) {
            fs.mkdirSync(`./uploads/worker/${req.worker.id}/workerimage`, {
              recursive: true,
            });
          }
          cb(null, `uploads/worker/${req.worker._id}/workerimage`);
        }
        break;
      }
      case "/post": {
        if (
          file.fieldname === "workImage1" ||
          file.fieldname === "workImage2" ||
          file.fieldname === "workImage3" ||
          file.fieldname === "workImage4"
        ) {
          if (
            !fs.existsSync(`./uploads/customer/${req.customer._id}/postimage`)
          ) {
            fs.mkdirSync(`./uploads/customer/${req.customer._id}/postimage`, {
              recursive: true,
            });
          }
          cb(null, `uploads/customer/${req.customer._id}/postimage`);
        }
        break;
      }
      default:
        cb(null, "uploads/");
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("You can upload only images"));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
