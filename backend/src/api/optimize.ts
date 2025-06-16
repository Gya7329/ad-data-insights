import { Router } from "express";
import { optimizeJob } from "../controllers/optimizeController";

const router = Router();

router.post("/:id", optimizeJob);

export default router;
