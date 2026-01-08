import {io} from '../index';
import { disconnect_socket, sockets_connect } from '../services/socket.handlers';

io.on("connection", (socket) => {

    //1. Connect Socket
    sockets_connect(socket);

    //2.Join Room
    socket.on('join-room' , (room_id) => {
        socket.join(room_id);
        console.log(`User joined in room`);
    });

    //3.Leave Room 
    socket.on('leave-room' , (room_id) => {
        socket.leave(room_id);        
        console.log('User leave the room');
    });
         
    //4. Disconnect Socket
    socket.on("disconnect", () => disconnect_socket(socket));

});

export default io;