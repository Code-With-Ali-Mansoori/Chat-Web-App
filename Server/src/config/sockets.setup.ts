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

    //9.Audio Calling ( WebRTC )
    socket.on('audio-call-invite', (room_id, callerId) => {
        socket.to(room_id).emit('incomming-audio-call', room_id, callerId); 
    });

    socket.on('reject-audio-call', (roomId, otherUserId) => {        
        socket.to(roomId).emit('reject-audio-called', roomId, otherUserId); 
    });

    socket.on('end-audio-call', (roomId, Call_EnderId) => {        
        io.to(roomId).emit('end-audio-called', roomId); 
    });

    socket.on('accept-audio-call', (roomId, reciverId) => {
        io.to(roomId).emit('audio-call-accepted', roomId, reciverId);
    });

    socket.on('audio-call-offer', (offer, roomId) => {
        socket.to(roomId).emit('Offer-audio-call', offer, roomId);
    });

    socket.on('answer-audio-call', (answer, roomId) => {        
        socket.to(roomId).emit("answered-audio-call", answer, roomId );
    });

    socket.on('Audio-call-Connected', (roomId) => {
        io.to(roomId).emit("connected-audio-call");
    });

    socket.on('ice-candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate2', candidate);
    });

    socket.on('audio-call-mute', (roomId, otherUser) => {
        // console.log('Muted');  
        io.to(roomId).emit('muted-audio')
    });

    socket.on('audio-call-unmute', (roomId, otherUser) => {
        // console.log('Unmuted'); 
        io.to(roomId).emit('unmuted-audio')
    });

    socket.on('AudioCall-not-reached', (roomId) => {
        socket.to(roomId).emit('AudioCall-not-reached', roomId);
    })

    //10. Video Call - WebRTC 
    socket.on('video-call-invite', (room_id, callerId) => {
        socket.to(room_id).emit('incomming-video-call', room_id, callerId); 
    });

    socket.on('reject-video-call', (roomId, otherUserId) => {        
        socket.to(roomId).emit('reject-video-called', roomId, otherUserId); 
    });

    socket.on('accept-video-call', (roomId, reciverId) => {
        io.to(roomId).emit('video-call-accepted', roomId, reciverId);
    });

    socket.on('video-call-offer', (offer, roomId) => {
        socket.to(roomId).emit('Offer-video-call', offer, roomId);
    });

    socket.on('answer-video-call', (answer, roomId) => {        
        socket.to(roomId).emit("answered-video-call", answer, roomId );
    });

    socket.on('video-call-Connected', (roomId) => {
        io.to(roomId).emit("connected-video-call");
    });

    socket.on('ice-candidate-video', (candidate, roomId) => {
        socket.to(roomId).emit('ice-candidate-video', candidate);
    });

    socket.on('video-call-mute', (roomId) => {
        console.log('Video Call Muted');  
        io.to(roomId).emit('muted-video')
    });

    socket.on('video-call-unmute', (roomId) => {
        console.log('Video Call Un-mute'); 
        io.to(roomId).emit('unmuted-video')
    });

    socket.on('end-video-call', (roomId) => {        
        io.to(roomId).emit('end-video-called', roomId); 
    });

    //Disconnecting the Call while Browser Refresh or tab changes
    socket.on('disconnect-the-call', (roomId) => {
        socket.to(roomId).emit('disconnect-the-call');
    });

    socket.on('VideoCall-not-reached', (roomId) => {
        socket.to(roomId).emit('VideoCall-not-reached', roomId);
    })
         
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
//     10 Loads All OLD Chat messages in room
