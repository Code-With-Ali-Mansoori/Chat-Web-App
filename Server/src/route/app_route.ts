import express from "express";
import { handle_ProfileSetup } from "../controller/user_handler";
import { authCheck } from "../middlewares/auth_jwt";
import { logout_user } from "../controller/user_handler";
import { welcome_user } from "../controller/user_handler";
import { search_user_handler } from "../controller/user_handler";
import { create_room_handler } from "../controller/room";

export const app_route = express.Router();

app_route.put('/user/profile/page', authCheck, handle_ProfileSetup);
app_route.delete('/user/logout', authCheck, logout_user);
app_route.get('/user/profile/data', authCheck, welcome_user);
app_route.get("/users/search", authCheck , search_user_handler);   // Search User

//Room Route
app_route.post("/create/room", authCheck, create_room_handler);    // Creating Room