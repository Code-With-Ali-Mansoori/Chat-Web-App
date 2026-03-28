import { Request, Response } from "express";
import crypto from "crypto";
import user_model from "../model/user_schema";
import { AuthPayload } from "../middlewares/auth_jwt";
import {cloudinary} from '../config/cloudinary.config'
import path from "path";
const DatauriParser = require('datauri/parser');

export const handle_ProfileSetup = async (req : Request, res : Response) => {
try {
    
    const user_avatar = req.file;
    const {username, gender, user_Bio } = req.body;
    
    if ( !username || !gender || !user_Bio) {
        return res.status(400).json({message: "Please Provide all data"})
    };

    let user_profile;
    let users_avatar;

    if (user_avatar) {

        let parser = new DatauriParser();
    
        const dataUri = parser.format(path.extname(user_avatar.originalname), user_avatar.buffer);

        //1. Store in Cloudinary
        const uploadedMedia = await cloudinary.uploader.upload(dataUri.content);

        const user_profile_URL = {
            avatar_url : uploadedMedia.url,
            avatar_publicId : uploadedMedia.public_id
        };

        user_profile = user_profile_URL.avatar_url;
    };

    if( user_avatar && user_profile!.length > 0) {
        users_avatar = user_profile;
    }
    
    const user_email = (req.user as AuthPayload).email;
    const Public_user_id = crypto.randomUUID();
    const isProfileCompleted = true;

    const existingUsername = await user_model.findOne({username});

    if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
    };

    //2. Store Cloudinary_URL in DB
    const updated_user = await user_model.findOneAndUpdate({email : user_email}, 
        {$set : {  
            username, 
            user_gender : gender, 
            user_Bio, 
            user_avatar : users_avatar,
            Public_user_id, 
            isProfileCompleted }
        });

    if ( !updated_user ) {
        return res.status(404).json({message : "User not found ❌"});    
    };

    return res.status(200).json({message : "Profile Setup Succesfully✅"});              

} catch (error) {
    console.log(error);
    return res.status(500).json({message : 'Internal server error 🚨'});

}};

export const HandleProfile_Init = async (req : Request, res : Response) => {
    try {

        const user = (req.user as AuthPayload);
        if ( !user ){ return res.json({message : "User data not found in Cookie"}) }

        const Db_user = await user_model.findOne({email : user.email});
        if ( !Db_user ){ return res.json({message : "User does not Exist"}) }

        const res_user = {
            email : Db_user.email,
            avatar : Db_user.user_avatar,
            provider: Db_user.provider,
            provider_Id : Db_user.provider_Id
        };


        return res.status(200).json({message : {
            data : res_user
        }});
        
    } catch (error) {
        console.log(error);
        return res.json({message : "Internal server Erorr, in Initialize Profile Setup"});

    }
}

export const welcome_user = async ( req: Request, res: Response ) => {
    try {

        const user = (req.user as AuthPayload);
        if ( !user ){ return res.json({message : "User data not found in Cookie"}) }

        const Db_user = await user_model.findOne({email : user.email});
        if ( !Db_user ){ return res.json({message : "User does not Exist"}) }

        const res_user = {
            username : Db_user.username,
            email : Db_user.email,
            avatar : Db_user.user_avatar,
            Bio : Db_user.user_Bio,
            gender : Db_user.user_gender,
            public_Id: Db_user.Public_user_id,
            user_id : Db_user._id
        };

        return res.status(200).json({message : {
            data : res_user
        }}); 
        
    } catch (error) {
        console.log(error);
        return res.json({message : "Internal server Erorr!"});

    }
};

export const logout_user = ( req: Request, res: Response ) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({message : 'Cookie Succesfully Deleted!'}); 
        
    } catch (error) {
        console.log(error);
        return res.json({message : "Internal server Erorr!"});

    }
};

export const search_user_handler = async ( req : Request, res : Response) => {
try {
    const query = req.query.query as string;//Getting Searched by Username or Public_Id
    const my_user = (req.user as AuthPayload);

    if ( !my_user ){ return res.status(404).json({message : "User data not found in Cookie"}) };
    
    const Db_user = await user_model.findOne({email : my_user.email});
    if ( !Db_user ){ return res.json({message : "User does not Exist"}) }
    
    if (!query) {
      return res.status(200).json({
        message: "Search is required",
      });
    };

    //This same data retrivell written by me! 👇
    // const users = await user_model.find({
    //   $or: [
    //     { username: { $regex: query, $options: "i" } },
    //     { Public_user_id: { $regex: query, $options: "i" } },
    //   ],
    // });

    // const other_user = users.filter((u) => {

    //     if ( u.email == Db_user.email) {
    //         return res.status(200).json({message : "User not Found"});
    //     };  

    //     return u;

    // }) .map( u => ({
    //     user_avatar: u.user_avatar,
    //     username: u.username,
    //     user_last_active: u.Last_active,
    //     user_status: u.Active_Status,
    // }));

    // console.log(other_user);

    //This mongoDB query written by GPT 👇
    
    const users = await user_model.find({
        $and: [
          { $or: [
            { username: { $regex: query, $options: "i" } },
            { Public_user_id: { $regex: query, $options: "i" } } 

          ],},
          { email: { $ne: Db_user.email } }, // 👈 exclude current user
        ],
    },
    {
        user_avatar: 1,
        username: 1,
        Last_active: 1,
        Public_user_id : 1,
        user_Bio : 1,
        user_gender : 1,
        Active_Status: 1,
        _id : 1
    });

    if (users.length <= 0 || !users) {
        return res.status(200).json({message : "User not Found"});
    };
    
    return res.status(200).json({message : users});

} catch (error) {    
    console.log(error);
    return res.status(500).json({message : "Error in Search Api", error});

}};