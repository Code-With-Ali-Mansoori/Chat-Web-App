import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import './config/oauth';
import { DB_Connection } from "./model/DB_Connection";
// import oauth from "./route/oauth";
import passport from "passport";
import path from "path";
import cookieParser from "cookie-parser";
import oauth_route from "./route/oauth";
import { app_route } from "./route/app_route";
import http from 'node:http';
import {Server} from 'socket.io';
import './utils/secure_msg';
import'./config/cloudinary.config';
import cors from 'cors'

const app = express();
const node_server = http.createServer(app);

export const io = new Server(node_server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

import { setupSockets } from "./config/sockets.setup";
setupSockets(io); // Initialize socket logic with the io instance

const PORT = process.env.PORT || 2000;
DB_Connection(process.env.MONGO_URI as string);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

//EJS setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

//Routing
app.use('/oauth', oauth_route);
app.use('/', app_route);

//Start server
node_server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Global Error Handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });
