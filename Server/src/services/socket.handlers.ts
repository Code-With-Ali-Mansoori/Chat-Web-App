import { Socket } from "socket.io";
import user_model from "../model/user_schema";
import message_model from "../model/msg_schema";
import room_model from "../model/chat_room_schema";
import { Decrypt_msg, Encrypt_msg } from "../utils/secure_msg";
import call_model from "../model/Call_Schema";

type dataType = {
    userId : string
}

type T = {
    callerId : string,
    calleeId : string
}

export const sockets_connect = async (socket : Socket) : Promise<dataType | null> => {
try {
    const userId = socket.data.user.userId;    
    const userDB = await user_model.findById(userId);  

    if (!userDB) { 
        socket.disconnect();
        return null;
    }

    await user_model.findByIdAndUpdate(userDB._id, { 
        Active_Status: true, 
        Last_active: new Date()
    });  
    
    return {
        userId : userDB.id
    };

} catch (error) {
    socket.disconnect();
    return null;
}};

export const hanlde_otherUserId = async (call_id : string, calleeId : string) : Promise<string | null> => {
try {

    const call_data = await call_model.findById(call_id);

    if ( !call_data) { 
        return null;
    };

    if ( call_data?.caller_id.toString() !== calleeId) {
        return call_data?.callee_id.toString();

    } else if ( call_data?.callee_id.toString() === calleeId ) {
        return call_data?.callee_id.toString();

    } else {
        return 'No userId is mathced!';

    };
        
} catch (error) {
    console.error('Error in hanlde_otherUserId', error);
    return null;
    
}};

export const Give_usersId = async (roomId : string, reciverId : string) : Promise< T | null> => {

    const room = await room_model.findById(roomId);
    if (!room) return null;
    
    const members = room.members[0];

    let callerId = members.admin_Userid.toString() === reciverId ? members?.Other_Userid.toString() : members?.admin_Userid.toString();

    let calleeId = members.admin_Userid.toString() !== reciverId ? members?.Other_Userid.toString() : members?.admin_Userid.toString();

    return { callerId, calleeId };

};

export const disconnect_socket = async (socket : Socket) => {   
try {
    const userId = socket.data.user.userId;

    const userDB = await user_model.findById(userId);    
    await user_model.findByIdAndUpdate(userId, { Active_Status: false });
        
    socket.disconnect();
    return;

} catch (error) {
    console.error(error);
    throw new Error("Erorr in Disconnect Handler");  

}};

export const handle_Send_Msg = async ( msg : any, msg_type : any, sender_id: any, room_id : any ) => {
try {
    
    const our_room = await room_model.findById(room_id);

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

    await room_model.findByIdAndUpdate(room_id, {
        last_Msg: store_msg._id
    }, { new: true });

    return {msg_Id : store_msg._id.toString(), mesg : msg};

} catch (error) {
    console.error('Error in Send-Message Logic in Sockets!', error);
    return;
}};

export const handleSeen = async (socket : Socket, room_id : any) => {
    const usersId = socket.data.user.userId;

    if (!usersId) {
        throw new Error('UserID not found for Seen Feature!');
    };

    const result = await message_model.updateMany({
        room_id: room_id,
        sender_id: { $ne: usersId },
        msg_seenBy: null
    }, {
        $set: {
            msg_seenBy: usersId
        }
    });

    //New Added by AI
    if (result.modifiedCount > 0) {
        const updatedMessages = await message_model.find({
            room_id: room_id,
            sender_id: { $ne: usersId },
            msg_seenBy: usersId
        }).select('_id');

        return updatedMessages.map((m) => m._id.toString());
    }

    return [];
};

export const instantMsg_Seen = async (  msg_Id : string, socket : any) => {
    try {
        if ( !msg_Id ) {
            return;
        };

        const myId = socket.data.user.userId;
        await message_model.findOneAndUpdate({_id : msg_Id}, { $set: { msg_seenBy: myId } });

    } catch (error) {
        console.error(error);
        return
    } 
};   
    
//     const all_msg_data = await message_model.find({room_id :room_id});

//     if (all_msg_data) {
    
//         return all_msg_data.map((msg) => {

//         const msgs = Decrypt_msg({
//             msg_content: msg!.msg_content!.toString(),
//             msg_iv: msg!.msg_iv!.toString(),
//             msg_tag: msg!.msg_tag!.toString()
//         });

//         return {
//             msg_id: msg._id,
//             msg: msgs,
//             msg_type : msg.msg_type,
//             msg_sender: msg.sender_id,
//             msg_seenBy : msg.msg_seenBy
//         };
    
//     });
//     } else {
//         return console.log('Data not found in room');
//     };
    
// } catch (error) {
//     console.log(error);
//     console.log('Erorr in reciver msg function of Sockets!');
     
// }};