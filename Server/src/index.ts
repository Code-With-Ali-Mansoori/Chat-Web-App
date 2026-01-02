import express from "express";
import dotenv from "dotenv";
dotenv.config();
import './config/oauth';
import { DB_Connection } from "./model/DB_Connection";
import oauth from "./route/oauth";
import passport from "passport";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;
DB_Connection(process.env.MONGO_URI as string)

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//EJS setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

//Routing
app.use('/oauth', oauth);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
