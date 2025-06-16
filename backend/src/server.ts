import express, { json } from "express";
import dotenv from "dotenv";
import uploadRouter from "./api/upload";
import analysisRouter from "./api/analysis";
import optimizeRouter from "./api/optimize";

dotenv.config();
const app = express();
app.use(json());

app.use("/api/upload", uploadRouter);
app.use("/api/analysis", analysisRouter);
app.use("/api/optimize", optimizeRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
