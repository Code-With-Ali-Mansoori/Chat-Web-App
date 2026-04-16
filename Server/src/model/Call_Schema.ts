import mongoose, { Document, Types, Schema } from "mongoose";

interface Call_log extends Document {
    caller_id : Types.ObjectId;
    callee_id : Types.ObjectId;
    call_duration : String;
    room_id : Types.ObjectId;
    call_connect : Boolean;
    call_type : 'vidoe-call' | 'audio-call'
};

const call_schema = new mongoose.Schema<Call_log>({
    caller_id : {
        type : Schema.Types.ObjectId,
        ref: "user_model",
        required : true

    },callee_id : {
        type : Schema.Types.ObjectId,
        ref: "user_model",
        required : true

    },
    call_duration : {
        type : String
    },
    room_id : {
        type : Schema.Types.ObjectId,
        ref: "room_model", 
        required : true,
    },
    call_connect : {
        type : Boolean,
        default : false
    },
    call_type : {
        required : true,
        type : String,
        enum : ['video-call' ,'audio-call']
    }
},
{timestamps : true});

const call_model = mongoose.model<Call_log>('Call_History', call_schema);
export default call_model; 