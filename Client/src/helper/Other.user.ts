import axios from "axios"

const HandleUserData = async (publicId : string) => {
    const res = await axios.get(`https://chatsy-y2s8.onrender.com/chat-room/users/publicId=${publicId}`, {withCredentials : true});
    return res?.data?.message;
};

export default HandleUserData;