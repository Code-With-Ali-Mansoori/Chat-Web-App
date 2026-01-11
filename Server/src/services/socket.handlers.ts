import { Socket } from "socket.io";
import user_model from "../model/user_schema";
import message_model from "../model/msg_schema";
import room_model from "../model/chat_room_schema";
import { Decrypt_msg, Encrypt_msg } from "../utils/secure_msg";
// import { Types } from "mongoose";
// import { AuthPayload } from "../middlewares/auth_jwt";
// import jwt from 'jsonwebtoken';

export const sockets_connect = async (socket : Socket) => {
try {
    const userId = socket.data.user.userId;

    const userDB = await user_model.findById({_id : userId });
    if (!userDB) return socket.disconnect();

    await user_model.findByIdAndUpdate(userDB._id, { Active_Status: true });

} catch (error) {
    socket.disconnect();
    console.log('User disconnected!');

}};

export const disconnect_socket = async (socket : Socket) => {   
try {
    const userId = socket.data.user.userId;
    await user_model.findByIdAndUpdate({_id : userId}, { Active_Status: false });
        
    socket.disconnect();
    // console.log("Socket disconnected:", socket.id);

} catch (error) {
    console.log(error);
    throw new Error("Erorr in Disconnect Handler");  

}};

export const handle_Send_Msg = async ( msg : any, msg_type : any, sender_id: any, room_id : any ) => {
try {
    const our_room = await room_model.findById({_id : room_id});

    if (!our_room) {
        throw new Error('Room not found!');  
    };

    const {msgs, msgs_iv, msg_tag} = Encrypt_msg(msg);  //Msg is secure here! 

    const store_msg = await message_model.create({
        room_id : our_room?._id,
        sender_id : sender_id,
        msg_content : msgs,
        msg_iv : msgs_iv,
        msg_tag : msg_tag,
        msg_type : msg_type 
    });

    await room_model.findByIdAndUpdate({_id : room_id}, {
        last_Msg: store_msg._id
    }, { new: true });

} catch (error) {
    console.log(error);
    console.log('Erorr in Send-Message Logic in Sockets!');

}};

export const handleSeen = async (socket : Socket, room_id : any) => {
    
    const usersId = socket.data.user.userId;
    socket.join(room_id);

    if (!usersId) {throw new Error('UserID not found for Seen Feature!')}
    
    await message_model.updateMany({
        room_id : room_id,
        sender_id : { $ne: usersId },  
        msg_seenBy : null
    },
    {$set : {
        msg_seenBy : usersId
    }});

};

// export const handle_reciver_msg = async (room_id : any) => {
// try {

//     const all_msg_data = await message_model.find({room_id :room_id});

//     if (all_msg_data.length === 0) return console.log('Dtaa not found in room');

//     return all_msg_data.map((msg) => {

//         const msgs = Decrypt_msg({
//             msg_content: msg.msg_content.toString(),
//             msg_iv: msg.msg_iv.toString(),
//             msg_tag: msg.msg_tag.toString()
//         });

//         return {
//             msg_id: msg._id,
//             msg: msgs,
//             msg_type : msg.msg_type,
//             msg_sender: msg.sender_id,
//             msg_seenBy : msg.msg_seenBy
//         };
//     });

    
// } catch (error) {
//     console.log(error);
//     console.log('Erorr in reciver msg function of Sockets!');
     
// }};