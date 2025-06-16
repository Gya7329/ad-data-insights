import { Router } from "express";
import multer from "multer";
import { handleUpload } from "../controllers/uploadController";

const upload = multer({ dest: "/tmp/" });
const router = Router();

router.post("/", upload.single("file"), handleUpload);

export default router;
