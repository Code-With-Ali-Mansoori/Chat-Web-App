import { createContext } from "react";
import type { Socket } from "socket.io-client";

const socketContext = createContext<null | Socket>(null);
export default socketContext;
