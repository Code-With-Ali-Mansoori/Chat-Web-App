import mongoose, { Document, Types, Schema } from "mongoose";

export interface MembersType extends Document {
    admin_Userid : Types.ObjectId,
    Other_Userid : Types.ObjectId
}

interface Room_Type extends Document {
    members : MembersType[];
    isGroup : boolean;
    created_By : Types.ObjectId;
    last_Msg? : Types.ObjectId | null;
};

const membersSchema = new Schema<MembersType>(
  {
    admin_Userid: {
      type: Schema.Types.ObjectId,
      ref: "user_model",
      required: true,
    },
    Other_Userid: {
      type: Schema.Types.ObjectId,
      ref: "user_model",
      required: true,
    },
  },
  { _id: false } // 👈 optional but recommended
);

const room_schema = new mongoose.Schema<Room_Type>({
    members : {
        type : [membersSchema],
        required : true,
    },
    isGroup : {
        type : Boolean,
        default : false
    },
    created_By : {
        type : Schema.Types.ObjectId,
        ref : 'user_model',
        required : true,
    },
    last_Msg : {
        type : Schema.Types.ObjectId, 
        ref : "message_model",
        default : null
    }
},
{timestamps : true});

const room_model = mongoose.model<Room_Type>('Chat-Room', room_schema);
export default room_model;   // <-- Learn in this Project