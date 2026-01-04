import { Request, Response } from "express";
import { AuthPayload } from "../middlewares/auth_jwt";
import user_model from "../model/user_schema";
import room_model from "../model/chat_room_schema";

export const create_room_handler = async (req: Request, res: Response ) => {
try {

    const ID = req.body;
    const users = req.user as AuthPayload;

    if (!ID || !ID.other_Members_ProviderId) {
        return res.status(404).json({message : "Member's ID is required"});
    };

    if (!users) {
       return res.status(404).json({message : "User not get from Cookie"});
    };

    const admin_member = await user_model.findOne({provider_Id : users.provider_Id});
    const other_member = await user_model.findOne({ provider_Id : ID.other_Members_ProviderId });  
    
    if ( !admin_member || !other_member ) {
        return res.status(404).json({message : "User not Found"})
    };


    //Finding Specific data by Two User_Id for Room is Existed?
    const isRoomExist = await room_model.findOne({
        isGroup: false,
        members: { $all: [
            { 
              admin_Userid : admin_member._id, 
              Other_Userid : other_member._id
            }
        ]}    
    });

    if ( isRoomExist ) {
    return res.status(200).json({message : {
        existedRoom : isRoomExist
    }});
    };

    const allMembers = [{
        admin_Userid : admin_member._id, 
        Other_Userid : other_member._id 
    }];

    const room = await room_model.create({
        members : allMembers,
        isGroup : false,
        created_By : admin_member._id,
        last_Msg : null
    });

    return res.status(201).json({
      message: "Room created successfully",
      room
    });
        
} catch (error) {
    return res.status(500).json({
      message: "Error in Server"
    }); 

}};