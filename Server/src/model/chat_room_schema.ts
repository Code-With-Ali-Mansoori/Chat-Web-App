// import mongoose, { Document } from "mongoose";

// interface LastMsg_type {
//     sender : string
// }

// interface Room_Type extends Document {
//     members : Types.ObjectId[];
//     isGroup : boolean;
//     admin?: Types.ObjectId; 
//     last_Msg : null | string,;
// };

// const room_schema = new mongoose.Schema<Room_Type>({
//     email : {
//         type : String,
//         required : true,
//         unique : true
//     },
//     username : {
//         type : String,
//         unique: true,
//     }},
// {timestamps : true});

// const room_model = mongoose.model<Room_Type>('Chat-Room', room_schema);
// export default room_model;