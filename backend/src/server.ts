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
app.listen(PORT, () => {
    // execute first query to ensure database connection is established
    console.log(`Server is running on port ${PORT}`);
    console.log("Database connection established successfully.");
    console.log(`API is available at http://localhost:${PORT}/api`);

    const { DATABASE_URL } = process.env;
    if (DATABASE_URL) {
        console.log(`Connected to database at ${DATABASE_URL}`);
    }
    const query = async () => {
        const { query } = await import("./db/index");
        try {
            const result = await query("SELECT NOW() AS current_time");
            console.log("Initial database query result:", result.rows[0]);
        } catch (error) {
            console.error("Error executing initial database query:", error);
        }
    }
    query().catch(console.error);
    console.log("Server setup complete.");
    console.log("Ready to handle requests.");
    console.log("API endpoints:");
});
