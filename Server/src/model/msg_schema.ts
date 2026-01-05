import mongoose, { Document, Schema } from 'mongoose';

export interface Msg_types extends Document {
    room_id: Schema.Types.ObjectId,
    sender_id: Schema.Types.ObjectId,
    msg_content : string,
    msg_type : "text" | "image" | "video" | "file",
    msg_seenBy? :  Schema.Types.ObjectId | null
};

const msg_schema = new mongoose.Schema({
    room_id : {
        required : true,
        type : Schema.Types.ObjectId,
        ref: "room_model",
        index: true
    },
    sender_id : {
        required : true,
        type : Schema.Types.ObjectId,
        ref: "user_model",
    },
    msg_content : {
        required : true,
        type : String
    },
    msg_type : {
        required : true,
        type : String,
        enum : ["text" , "image" , "video" , "file"],
        default: "text"
    },
    msg_seenBy : {
        type : Schema.Types.ObjectId,
        ref: "user_model",
        default: null,
    }
},{ timestamps: true });

const message_model = mongoose.model<Msg_types>('message_model', msg_schema);
export default message_model