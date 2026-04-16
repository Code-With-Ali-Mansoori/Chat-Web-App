import { AuthPayload } from "../middlewares/auth_jwt";
import call_model from "../model/Call_Schema";
import { Request, Response } from "express";
import user_model from "../model/user_schema";

export const handle_Call_creation = async (req : Request, res : Response) : Promise<void> => {
try {
    
    const {caller_id, callee_id, room_id, call_type} = req.body;

    const call = await call_model.create({
        caller_id, callee_id, room_id, call_type
    });

    res.status(201).json({message : 'Call Data Created', call_id : call._id});
    
} catch (error) {
    console.log(error);
    res.status(400).json({message : 'Error in Call creation'});

}};

export const handle_Get_CallHistory =  async (req : Request, res : Response) => {
    try {

        const users = req.user as AuthPayload;

        if (!users) {
            return res.status(404).json({message : "User not get from cookies"})
        };

        const mine = await user_model.findOne({email: users.email});  

        if (!mine) {
            return res.status(404).json({message : "User not Found in DB!"});
        };

        const call_history = await call_model.find({
            $or : [
                    {caller_id : mine._id},
                    {callee_id : mine._id}
                ]
        }).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json({message : call_history});        

    } catch (error) {
        console.log(error);
        res.status(400).json({message : 'Error in Get Call History!'});
    }
};

export const handle_Call_Logs_Update =  async (req : Request, res : Response) => {
    try {

        const users = req.user as AuthPayload;
        const { call_duration, call_connect, call_Id } = req.body;

        if (!users) {
            return res.status(404).json({message : "User not get from cookies"})
        };

        const mine = await user_model.findOne({email: users.email});  

        if (!mine) {
            return res.status(404).json({message : "User not Found in DB!"});
        };

        const CallHistory_updated = await call_model.findOneAndUpdate({
            _id: call_Id,
            $or: [
                { caller_id: mine._id },
                { callee_id: mine._id }
            ]},
            {
                call_duration,
                call_connect

            }, { new: true } //returns updated doc
        );

        return res.status(200).json({message : CallHistory_updated});        

    } catch (error) {
        console.log(error);
        res.status(400).json({message : 'Error in Update Call History!'});
    }
};

export const hanlde_history_user = async (req : Request, res : Response) => {
try {
    const users = req.user as AuthPayload;
    const userId = req.params.userId;

    if (!users) {
        return res.status(404).json({message : "User not get from cookies"})
    };

    if (!userId) {
        return res.status(404).json({message : "User not Found in Praams!"});
    };

    const otherUser = await user_model.findById(userId); 

    if (!otherUser) {
        return res.status(404).json({message : "User not Found in DB!"});
    };

    return res.status(200).json({message : {
        username : otherUser.username,
        user_avatar : otherUser.user_avatar
    }});  
    
} catch (error) {
    console.log(error);
    return res.status(400).json({message : 'Error in Users Call History!'});    
}};