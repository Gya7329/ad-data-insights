import { Router } from "express";
import { getAnalysisStatus } from "../controllers/analysisController";

const router = Router();

router.get("/:id", getAnalysisStatus);

export default router;
