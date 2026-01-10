import crypto from 'crypto';

type msg_types = {
    msg_content : string,
    msg_iv : string,
    msg_tag : string,
};

const SECRET_KEY = Buffer.from(
  process.env.MESSAGE_SECRET_KEY as string,
  "hex"
);

const algorithm = "aes-256-gcm";

export const Encrypt_msg = (msg : string) => {

    const iv = crypto.randomBytes(12);   // Unique for all msgs
    const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv);

    let encrypted_msg = cipher.update(msg, 'utf8', 'hex');
    encrypted_msg += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
        msgs : encrypted_msg,
        msgs_iv : iv.toString("hex"),
        msg_tag : authTag.toString("hex")
    };
};

export const Decrypt_msg = ({msg_content, msg_iv, msg_tag} : msg_types) => {
try {
    
    // const {msg_content, msg_iv, msg_tag} = data;

    const decipher = crypto.createDecipheriv(
        algorithm, 
        SECRET_KEY, 
        Buffer.from(msg_iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(msg_tag, "hex"));

    let decrypted_msg = decipher.update(msg_content, 'hex', 'utf8');
    decrypted_msg += decipher.final("utf8");

    return decrypted_msg;  //Plain Msg which is Decyrpted -> Unlock

} catch (error) {
    console.log(error);
}
};;
