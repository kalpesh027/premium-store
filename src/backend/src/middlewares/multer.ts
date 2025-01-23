import multer from "multer";

export const multiUpload = multer().array("photos", 5);
