import axios from "axios"

const HandleUserData = async (publicId : string) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-room/users/publicId=${publicId}`, {withCredentials : true});
    return res?.data?.message;
};

export default HandleUserData;
