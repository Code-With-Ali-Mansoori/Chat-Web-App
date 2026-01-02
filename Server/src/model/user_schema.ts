import mongoose, { Document } from "mongoose";

interface User_Type extends Document {
    Public_user_id? : string, 
    user_avatar? : string, 
    username? : string,
    email : string,
    user_gender? : 'Male' | 'Female',
    user_Bio? : string,
    provider : 'Google' | 'Facebook',
    provider_name : string,
    provider_Id : string,
    isProfileCompleted : Boolean
    Last_active? : Date
};

const user_schema = new mongoose.Schema<User_Type>({
    email : {
        type : String,
        required : true,
        unique : true
    },
    username : {
        type : String
    },
    Public_user_id : {
        type : String
    },
    user_avatar : {
        type : String,
        default : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'
    },
    user_gender : {
        type : String,
        enum : ['Male' , 'Female']
    },
    user_Bio : {
       type : String
    },
    provider : {
        type : String,
        required : true,
        enum : ['Google', 'Facebook']
    },
    provider_Id : {
        type : String,
        required : true,
    },
    provider_name : {
        type : String,
        required : true,
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    Last_active : {
        type : Date,
        default : Date.now
    }},
{timestamps : true});

const user_model = mongoose.model<User_Type>('User_Info',user_schema);
export default user_model;