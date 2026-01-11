import dotenv from "dotenv";
dotenv.config();
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

const app = express();
const node_server = http.createServer(app);

export const io = new Server(node_server);
import "../src/config/sockets.setup";   // Importing Sockets Logic 

const PORT = process.env.PORT || 5000;
DB_Connection(process.env.MONGO_URI as string)

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser())

//EJS setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

//Routing
app.use('/oauth', oauth_route);
app.use('/', app_route);

// Start server
node_server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
