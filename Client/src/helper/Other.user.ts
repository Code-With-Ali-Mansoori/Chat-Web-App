import axios from "axios"

const HandleUserData = async (publicId : string) => {
    const res = await axios.get(`http://localhost:5000/chat-room/users/publicId=${publicId}`, {withCredentials : true});
    return res?.data?.message;
};

export default HandleUserData;