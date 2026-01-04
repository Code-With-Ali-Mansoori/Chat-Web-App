import { Request, Response } from "express";
import { AuthPayload } from "../middlewares/auth_jwt";
import user_model from "../model/user_schema";
import room_model from "../model/chat_room_schema";

export const create_room_handler = async (req: Request, res: Response ) => {
try {

    const ID = req.body;
    const users = req.user as AuthPayload;

    if ( !ID || !ID.other_Members_ProviderId) {
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
        return res.status(200).json({message : 'Room is Already Existed', isRoomExist });
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
      room
    });
        
} catch (error) {
    console.log(error);
    
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

    // Learn in this Project
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

    return res.status(200).json({message : All_Rooms});
        
} catch (error) {
    console.log(error);
    
    return res.status(500).json({
      message: "Error in Server"
    });       
}
}