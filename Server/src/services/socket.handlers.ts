import { Socket } from "socket.io";
import { AuthPayload } from "../middlewares/auth_jwt";
import user_model from "../model/user_schema";
import jwt from 'jsonwebtoken';

export const sockets_connect = async (socket : Socket) => {
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
    if (!token) return socket.disconnect();

    const decoded  = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
        
    if ( !decoded ) {
        console.log("No Token found");
        return socket.disconnect();        
    };

    const user = await user_model.findOne({ email: decoded.email });
    if (!user) return socket.disconnect();

    await user_model.findByIdAndUpdate(user._id, 
    { Active_Status: true });
    
    // USER IDENTIFIED
    const socket_user = {
      id: user._id.toString(),  
      name: user.provider_name
    };

    console.log("Socket connected:", socket_user.name,' => ',socket.id);

} catch (error) {
    socket.disconnect();
    console.log("Socket disconnected:", socket.id);

}};

export const disconnect_socket = async (socket : Socket) => {
try {
  
        const cookieHeader = socket.handshake.headers.cookie;
    
        if (!cookieHeader) {
            console.log("No cookies found");
            throw new Error("No cookies found")
        };

        const cookies = Object.fromEntries(
            cookieHeader.split("; ").map(c => c.split("="))
        );

        const token = cookies.token; 
        if (!token){ throw new Error("No Token found")};
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload
                
        if ( !decoded ) {
            console.log("No Token found");
            throw new Error("No user data found")       
        };
        
        const user = await user_model.findOne({ email: decoded.email });
        if (!user) {throw new Error("No user found")}
        
        await user_model.findByIdAndUpdate(user._id, { Active_Status: false });
        console.log("Socket disconnected:", socket.id);

} catch (error) {
    console.log(error);
    throw new Error("Erorr in Disconnect Handler");

}};

