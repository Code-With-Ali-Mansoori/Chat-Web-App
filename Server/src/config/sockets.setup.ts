import {io} from '../index';
import { disconnect_socket, handle_Send_Msg, handleSeen, instantMsg_Seen, sockets_connect } from '../services/socket.handlers';
import { socket_middleware } from '../utils/sockets.middleware';

io.use(socket_middleware);  //Socket Middlware

io.on("connection", (socket) => {

    //1. Connect Socket
    sockets_connect(socket);

    //2.Join Room & Msg seen when enter in Rooms
    socket.on('join-room', async (room_id) => {
        const updatedIds = await handleSeen(socket, room_id); 
        //It will give all the seen msgs_Id when enetered in Room

        //NEW- Notify clients which specific message will be Updated as Seen in UI
        if (updatedIds && updatedIds.length > 0) {
            io.to(room_id).emit('update_seen_many', updatedIds);
        };

    });
    
    //3.Leave Room 
    socket.on('leave-room' , (room_id) => {
        socket.leave(room_id);        
    });

    //4. Start Typing
    socket.on('start-typing', (room_id) => {                
        socket.to(room_id).emit('users-typing'); //io => socket 
    });

    //5. Stop Typing
    socket.on('stop-typing', (room_id) => {
        socket.to(room_id).emit('stop-typinggggg');
    });

    //6. send Messages , Msg Seen in Rooms & Reciver msg
    socket.on('send-message', async ({msg, msg_type, sender_id, room_id}) => {

        const res : any = await handle_Send_Msg(msg, msg_type, sender_id, room_id);

        if (res?.msg_Id) {
            io.to(room_id).emit('receive-msg', res.msg_Id, res.mesg, sender_id, room_id);
        };
    });

    //7. Client reports instant read state. Server persists and broadcasts update.
    socket.on('msg_seen_instantly', async ({ msg_Id, room_id }) => {
        await instantMsg_Seen(msg_Id, socket);

        // emit to room so sender can update UI for this message
        socket.to(room_id).emit('update_seen', msg_Id);
    });

    //8. Media
    socket.on('send-media', (data) => {

        const { msg_id, roomId, sender_Id, media_URL, media_Type } = data;        
        io.to(roomId).emit('receive-media', msg_id, sender_Id, media_URL, media_Type, roomId); //Both user will got!
    });
         
    //8. Disconnect Socket
    socket.on("disconnect", () => disconnect_socket(socket));
});

export default io;

// 1. Setup Sockets in Frontend 
// 2. Socket will connect through out the app
// 3. Socket works on 
//      1 Connection ✅
//      2 Join-Room ✅
//      3 Leave-Room ✅
//      4 Typing-start ✅
//      5 Typing-Stop ✅
//      6 Send Messages From Client ✅
//      7 Send Messages To Client ✅
//      8 Seen Features ✅
//      9 Media Send ✅
//     10 Loads All Chat messages 
