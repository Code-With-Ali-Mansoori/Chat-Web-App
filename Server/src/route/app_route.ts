import express from "express";
import { handle_ProfileSetup, HandleProfile_Init } from "../controller/user_handler";
import { authCheck } from "../middlewares/auth_jwt";
import { logout_user } from "../controller/user_handler";
import { welcome_user } from "../controller/user_handler";
import { search_user_handler } from "../controller/user_handler";
import { create_room_handler, EveryUserData, get_Old_Msgs, handleMedia_msgs, search_my_rooms , specific_user} from "../controller/room";
import { chat_sockets, welcome_sockets } from "../controller/ejs";

import multer from "multer";
import { handle_Call_creation, handle_Call_Logs_Update, handle_Get_CallHistory, hanlde_history_user } from "../controller/call";
const storage = multer.memoryStorage();
const upload = multer({storage});

export const app_route = express.Router();

//Main App Routes
app_route.get('/is/auth', authCheck ,(req, res) => {
    res.status(200).json('User is Authenticated!');
    return;
});

app_route.put('/user/profile/setup', authCheck, upload.single("user_avatar"), handle_ProfileSetup); //Profile setup -- add multer and cloudinary code
app_route.delete('/user/logout', authCheck, logout_user);   //Logout
app_route.get('/user/profile', authCheck, welcome_user); // MY- welcome page - Profile page 
app_route.get("/users/search", authCheck , search_user_handler); //to search other users
app_route.get('/init/user/profile', authCheck, HandleProfile_Init); //User Setup temp data 

//Room Routes
app_route.post("/create/chat-room", authCheck, create_room_handler);// Creating Room
app_route.get("/my/chat-rooms", authCheck, search_my_rooms);// Searching All my Rooms
app_route.get('/chat-room/users/publicId=:id', authCheck, specific_user);//used in each chat room users 
app_route.get('/chat-room/roomId=:roomId', authCheck, EveryUserData);
app_route.get('/chat-room/all_messages/:roomId', authCheck, get_Old_Msgs);//get all old message 
app_route.post("/room/msgs/media", authCheck, upload.single('file'), handleMedia_msgs);

//Call Routes
app_route.post("/create/call-history/data", handle_Call_creation);
app_route.get("/get/call-history/data", authCheck, handle_Get_CallHistory);
app_route.get("/call-history/indiv/:userId", authCheck, hanlde_history_user);
app_route.patch("/update/call-history/data", authCheck, handle_Call_Logs_Update);


//Testing Sockets
// app_route.get('/welcome', authCheck , welcome_sockets); 
// app_route.get('/chats', authCheck , chat_sockets);