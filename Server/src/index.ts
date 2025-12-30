import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { DB_Connection } from "./model/DB_Connection";
import route from "./route/oauth";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
DB_Connection(process.env.MONGO_URI as string)

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', route);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
