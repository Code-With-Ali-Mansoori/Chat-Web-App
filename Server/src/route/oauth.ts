import express from "express";
import {testController} from "../controller/user";

const route = express.Router();

route.get("/privacy", testController);

export default route;