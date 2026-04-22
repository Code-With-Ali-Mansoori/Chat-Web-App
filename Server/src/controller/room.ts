import { Request, Response } from "express";
import { AuthPayload } from "../middlewares/auth_jwt";
import user_model from "../model/user_schema";
import room_model from "../model/chat_room_schema";
import message_model from "../model/msg_schema";
import { Decrypt_msg } from "../utils/secure_msg";
import {cloudinary} from '../config/cloudinary.config'
import path from "path";
const DatauriParser = require('datauri/parser');

export type ChatUserData = {
  userId?: string;
  email?: string;
  username?: string;
  user_avatar?: string;
  active_Status?: boolean;
  last_active?: Date;        // ISO date string
  public_user_id?: string;
};

export const create_room_handler = async (req: Request, res: Response ) => {
try {
    const {userId} = req.body;
    const users = req.user as AuthPayload;

    if ( !userId ) {
        return res.status(404).json({message : "Member's ID is required"});
    };

    if (!users) {
       return res.status(404).json({message : "User not get from Cookie"});
    };

    const admin_member = await user_model.findOne({provider_Id : users.provider_Id});
    const other_member = await user_model.findOne({ Public_user_id : userId });  
    
    if ( !admin_member || !other_member ) {        
        return res.status(404).json({message : "User not Found"})
    };

    // Learn in this Project
    const isRoomExist = await room_model.findOne({ // Finding Specific data by Two User_Id (is Existed?)
        isGroup: false,
        members: { $all: [
            { 
              admin_Userid : admin_member._id, 
              Other_Userid : other_member._id
            }
        ]}    
    });

    if ( isRoomExist ) {
        return res.status(200).json(
            {message : 'Room is Already Existed', data : isRoomExist });
    };

    // Learn in this Project
    const allMembers = [{
        admin_Userid : admin_member._id, 
        Other_Userid : other_member._id 
    }];

    // Learn in this Project
    const room = await room_model.create({
        members : allMembers,
        isGroup : false,
        created_By : admin_member._id,
        last_Msg : null
    });

    return res.status(201).json({
      message: "Room created successfully",
      data: room
    });
        
} catch (error) {
    console.error('Error in create_room_handler:', error);
    
    return res.status(500).json({
      message: "Error in Server"
    }); 
}};

export const search_my_rooms = async (req: Request, res: Response ) => {
try {

    const users = req.user as AuthPayload;

    if (!users) {
        return res.status(404).json({message : "User not get from cookies"})
    };

    const db_user = await user_model.findOne({
        email : users.email
    });

    if (!db_user) {
        return res.status(404).json({message : "User does not Exist"})
    };
    
    const user_Id = db_user._id;

    // Learn in this Proje00ct
    const All_Rooms = await room_model.find({     // MongoDB query to get all rooms of a user!
        isGroup : false,
        members : {
            $elemMatch: { 
                $or : [
                    {admin_Userid : user_Id},
                    {Other_Userid : user_Id}
                ]
            }
        }
    });

    if ( All_Rooms.length <= 0 ) {
        return res.status(200).json({message : "No Room is Created Yet!"})
    };

    const my_Rooms = All_Rooms.map((rooms) => ({
        roomId : rooms._id,
        members : rooms?.members,
        last_Msg  : rooms.last_Msg
    }));

    return res.status(200).json({message : my_Rooms});
        
} catch (error) {
    console.error('Error in search_my_rooms:', error);
    
    return res.status(500).json({
      message: "Error in Server"
    });       
}
}

export const specific_user = async (req : Request, res : Response) => {
    try {

        // const user_id = req.query.id;
        const public_Id = req.params.id as string;

        if (!public_Id) {
            return res.status(404).json({message : "User ID is required!"});
        };

        const user = await user_model.findOne({Public_user_id: public_Id});

        if (!user) {
            return res.status(404).json({message : "User not found in DB!"});
        };
        
        res.status(200).json({message : {
            userId : user._id,
            username : user.username,
            user_publicId : user.Public_user_id,
            userAvatar : user.user_avatar,
            active_status : user.Active_Status,
            last_active : user.Last_active,
        }});

        return;
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Error in Search Api", error});

    }
};

export const EveryUserData =  async (req : Request, res : Response) => {
try { 
    const users = req.user as AuthPayload;
    const roomId = req.params.roomId;

    if (!roomId) {
        return res.status(404).json({message : 'Room ID is required in Parameter!'})
    };

    if (!users) {
        return res.status(401).json({message : 'User is Un-Authorized!'})
    };

    const myData = await user_model.findOne({email : users.email});
    const Rooms = await room_model.findById(roomId);

    const userId = myData?._id.toString();
    const userId_1 = Rooms?.members?.[0]?.admin_Userid.toString();
    const userId_2 = Rooms?.members?.[0]?.Other_Userid.toString();

    let otherUserId : string | undefined;

    if (userId_1 === userId) {
        otherUserId = userId_2;

    } else if (userId_2 === userId) {
        otherUserId = userId_1;

    };  

    const otherUser_Data = await user_model.findById(otherUserId);

    const userData: ChatUserData = {
        userId : otherUser_Data?._id.toString(),
        email : otherUser_Data?.email,
        username : otherUser_Data?.username,
        user_avatar : otherUser_Data?.user_avatar,
        active_Status : otherUser_Data?.Active_Status,
        last_active : otherUser_Data?.Last_active,
        public_user_id : otherUser_Data?.Public_user_id,
    };
    
    res.status(200).json({
        message : userData 
    });

    return;

 } catch (error) {
    console.error('Error in EveryUserData:', error);
    res.status(500).json({'error' : error});
    return;
 
}};

//fetch in Chat!
export const get_Old_Msgs = async (req : Request, res : Response) => {
    try {
    
        const roomid = req.params.roomId;

        if (!roomid) {
            return res.status(404).json({message : 'Room ID is required in Parameter!'})
        };

        const all_msg_data = await message_model.find({room_id :roomid});
    
        if (all_msg_data.length === 0) {
            return res.status(200).json({message : 'No data found in a chat!'})
        };
    
        const allData = all_msg_data.map((msg) => {
    
            if ( msg.msg_type == 'text' ) {

            const msgs = Decrypt_msg({
                msg_content: msg?.msg_content!.toString(),
                msg_iv: msg?.msg_iv!.toString(),
                msg_tag: msg?.msg_tag!.toString()
            });
    
            return {
                msg_id: msg._id,
                msg: msgs,
                msg_type : msg.msg_type,
                msg_sender: msg.sender_id,
                msg_seenBy : msg.msg_seenBy,
                sentAt : msg?.createdAt!
            };

            } else {

                return {
                    msg_id: msg._id,
                    msg_type : msg.msg_type,
                    msg_sender: msg.sender_id,
                    msg_seenBy : msg.msg_seenBy,
                    mediaURL : msg?.media?.media_url!,
                    sentAt : msg?.createdAt!
                };
            };
        });
    
        res.status(200).json({message : allData});
        return;
        
    } catch (error) {
        console.error('Error in get_Old_Msgs:', error);
        return res.status(500).json({message : error})
    };
};

//Hanlde Media!
export const handleMedia_msgs = async (req : Request, res : Response) => {
try {
    const file = req.file; 
    const {senderId , roomId } = req.body;

    if( !file ) {
        return res.status(500).json({message : 'Media File not get!'})
    };

    //1. Store in Cloudinary
    let parser = new DatauriParser();

    const dataUri = parser.format(path.extname(file.originalname), file.buffer);
    
    // { resource_type: "auto" } => It will automaticlly hanlder types of Files!
    const uploadedMedia = await cloudinary.uploader.upload(dataUri.content, { resource_type: "auto"});

    //2. Store Cloudinary_URL and Public_Id in DB

    if( !roomId || !senderId ) {
        return res.status(500).json({message : 'Frontend Should to provide all required data'})
    };

    const mediaDB = await message_model.create({
        room_id : roomId,
        sender_id : senderId,
        msg_type : "Media-file",
        media : {
            media_url : uploadedMedia.url,
            media_publicId : uploadedMedia.public_id
        }
    });

    //3. Return that store data to res
    const data = {
        msg_id : mediaDB._id.toString(),
        roomId : mediaDB.room_id,
        senderId : mediaDB.sender_id,
        mediaURL : mediaDB.media?.media_url
    };

    return res.status(200).json({message : 'Media Store in Backend', data: data});
        
} catch (error) {
    console.error('Error in handleMedia_msgs:', error);
    return res.status(500).json({message : 'Erorr in Media_Msg Controller'});
    
}};