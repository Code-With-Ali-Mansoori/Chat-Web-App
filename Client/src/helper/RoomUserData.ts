import axios from 'axios';

const RoomUserData = async (roomId : string) => {
    const res = await axios.get(`http://localhost:5000/chat-room/roomId=${roomId}`, {withCredentials : true});
    
    return res; 
};

export default RoomUserData;