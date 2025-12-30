import express from "express";
import {testController} from "../controller/user";

const route = express.Router();

route.get("/testing", testController);

export default route;