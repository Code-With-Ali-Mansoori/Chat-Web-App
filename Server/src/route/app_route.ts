import express from "express";
import { handle_ProfileSetup } from "../controller/user_handler";
import { authCheck } from "../middlewares/auth_jwt";
import { logout_user } from "../controller/user_handler";
import { welcome_user } from "../controller/user_handler";
import { search_user_handler } from "../controller/user_handler";
import { create_room_handler, search_my_rooms } from "../controller/room";

export const app_route = express.Router();

//Main App Routes
app_route.put('/user/profile/page', authCheck, handle_ProfileSetup);
app_route.delete('/user/logout', authCheck, logout_user);   
app_route.get('/user/profile', authCheck, welcome_user); 
app_route.get("/users/search", authCheck , search_user_handler);

//Room Routes
app_route.post("/create/room", authCheck, create_room_handler);    // Creating Room
app_route.get("/my/rooms", authCheck, search_my_rooms);    // Searching All Rooms