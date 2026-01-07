import { Request, Response } from "express";
import crypto from "crypto";
import user_model from "../model/user_schema";
import { AuthPayload } from "../middlewares/auth_jwt";

export const handle_ProfileSetup = async (req : Request, res : Response) => {
try {
    
    const {username, user_gender, user_Bio, user_avatar} = req.body;

    if ( !username || !user_gender || !user_Bio ){
        return res.status(400).json({message: "Please Provide all data"})
    };

    const user_email = (req.user as AuthPayload).email;
    const Public_user_id = crypto.randomUUID();
    const isProfileCompleted = true;

    const existingUsername = await user_model.findOne({username});

    if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
    };

    const updated_user = await user_model.findOneAndUpdate({email : user_email}, 
        {$set : {  
            username, 
            user_gender, 
            user_Bio, 
            user_avatar,
            Public_user_id, 
            isProfileCompleted }
        });

    if ( !updated_user ) {
        return res.status(404).json({message : "User not found ❌"});    
    };

    return res.status(200).json({message : "Profile Setup ✅"});              

} catch (error) {
    console.log(error);
    return res.status(500).json({message : 'Internal server error 🚨'});

}};


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
    const query = req.query.query as string;  // Getting Searched by Username or Public_Id

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    };

    const users = await user_model.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { Public_user_id: { $regex: query, $options: "i" } },
      ],
    }).select("username email Public_user_id user_avatar").limit(5);

    if (users.length <= 0) {
        return res.status(404).json({message : "User not Found"});
    };

    return res.status(200).json({message : users})

} catch (error) {    
    console.log(error);
    return res.status(500).json({message : "Error in Search Api", error});

}};

