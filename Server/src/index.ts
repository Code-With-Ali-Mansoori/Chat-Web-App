import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
