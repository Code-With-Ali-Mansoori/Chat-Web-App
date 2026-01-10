import { Socket } from "socket.io";
import { AuthPayload } from "../middlewares/auth_jwt";
import user_model from "../model/user_schema";
import jwt from 'jsonwebtoken';

export const socket_middleware = async (socket : Socket, next : (err?: Error) => void) => {
try {

    const cookieHeader = socket.handshake.headers.cookie;
    
    if (!cookieHeader) {
      console.log("No cookies found");
      return socket.disconnect();
    }

    // parse whole header into cookie's Token
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(c => c.split("="))
    );

    const token = cookies.token; 
    if (!token) {return socket.disconnect()};

    const decoded  = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
        
    if ( !decoded ) {
        console.log("No Token found");
        return socket.disconnect();        
    };

    const userDB = await user_model.findOne({ email: decoded.email });
    if (!userDB) return socket.disconnect();
    
    // USER IDENTIFIED
    const socket_user = {
      userId: userDB._id,  
      username: userDB.provider_name,
      user_email : userDB.email,
      provider : userDB.provider
    };

    socket.data as any;
    socket.data.user = socket_user;
    
    next();
    
} catch (error) {
    socket.disconnect();
    next(new Error("Unauthorized"));

}}