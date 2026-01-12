import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Msg_types extends Document {
    room_id: Types.ObjectId,
    sender_id: Types.ObjectId,
    msg_content? : string,
    msg_type : "text" | "Media-file",
    media? : {
        media_url? : string;
        media_publicId? : string;
    }
    msg_iv? : string;
    msg_tag? : string;
    msg_seenBy? : Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
};

const msg_schema = new mongoose.Schema<Msg_types>({
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
        type : String
    },
    msg_iv : {
        type : String
    },
    msg_tag : {
        type : String
    },
    msg_type : {
        required : true,
        type : String,
        enum : ["text" , "Media-file"],
        default: "text"
    },
    msg_seenBy : {
        type : Schema.Types.ObjectId,
        ref: "user_model",
        default: null,
    },
    media : {
        media_url : String,
        media_publicId : String
    }
},{ timestamps: true });

//This Function Run before Saving data
//To validate msg or media is there or not!
msg_schema.pre("validate", function (this: Msg_types) {

  if (this.msg_type === "Media-file" && !this.media?.media_url) {
    throw new Error("Media URL is required for media messages");
  }

  if (this.msg_type === "text" && !this.msg_content) {
    throw new Error("Text content is required for text messages");
  }

});

const message_model = mongoose.model<Msg_types>('message_model', msg_schema);
export default message_model