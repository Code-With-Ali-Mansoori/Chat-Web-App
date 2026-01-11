import express from "express";
import { handle_ProfileSetup } from "../controller/user_handler";
import { authCheck } from "../middlewares/auth_jwt";
import { logout_user } from "../controller/user_handler";
import { welcome_user } from "../controller/user_handler";
import { search_user_handler } from "../controller/user_handler";
import { create_room_handler, get_Old_Msgs, handleMedia_msgs, search_my_rooms , specific_user} from "../controller/room";
import { chat_sockets, welcome_sockets } from "../controller/ejs";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage});

export const app_route = express.Router();

//Main App Routes
app_route.put('/user/profile/page', authCheck, handle_ProfileSetup); //Profile setup
app_route.delete('/user/logout', authCheck, logout_user);   //Logout
app_route.get('/user/profile', authCheck, welcome_user); //welcome page & Profile page
app_route.get("/users/search", authCheck , search_user_handler); //to search other users

//Room Routes
app_route.post("/create/room", authCheck, create_room_handler);    // Creating Room
app_route.get("/my/rooms", authCheck, search_my_rooms);    // Searching All Rooms
app_route.get('/rooms/users', authCheck, specific_user); //used in each chat room users 
app_route.get('/room/all_messages/:roomId', get_Old_Msgs);  //get all old message 
app_route.post("/room/msgs/media", upload.single('file'), handleMedia_msgs);

//Testing Sockets
app_route.get('/welcome', authCheck , welcome_sockets); 
app_route.get('/chats', authCheck , chat_sockets);