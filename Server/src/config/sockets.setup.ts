import { Socket, Server } from 'socket.io';
import { disconnect_socket, Give_usersId, handle_Send_Msg, handleSeen, hanlde_otherUserId, instantMsg_Seen, sockets_connect } from '../services/socket.handlers';
import { socket_middleware } from '../utils/sockets.middleware';

// Map to store userId -> Set of socketIds for multi-tab support
export const userSocketMap = new Map<string, Set<string>>();

// Helper to get all socket IDs for a user
const getSocketsForUser = (userId: string): string[] => {
    const sockets = userSocketMap.get(userId);
    return sockets ? Array.from(sockets) : [];
};

// Helper to emit to all sockets of a user
const emitToUser = (io: Server, userId: string, event: string, ...args: any[]) => {
    const sockets = getSocketsForUser(userId);
    sockets.forEach(socketId => {
        io.to(socketId).emit(event, ...args);
    });
};

export const setupSockets = (io: Server) => {
    io.use(socket_middleware);

    io.on("connection", (socket: Socket) => {
        // Start authentication immediately but don't block listener registration
        const authPromise = (async () => {
            const data = await sockets_connect(socket);
            if (data) {
                // Add socket to user's set
                const { userId } = data;
                if (!userSocketMap.has(userId)) {
                    userSocketMap.set(userId, new Set());
                }
                userSocketMap.get(userId)?.add(socket.id);
                return data;
            }
            return null;
        })();

        // 2. Join Room (Registered synchronously to avoid missing early emits)
        socket.on('join-room', async (room_id: string) => {
            const data = await authPromise;
            if (!data) return;

            socket.join(room_id);

            const updatedIds = await handleSeen(socket, room_id);
            if (updatedIds && updatedIds.length > 0) {
                io.to(room_id).emit('update_seen_many', updatedIds);
            }
        });

        // 3. Leave Room
        socket.on('leave-room', (room_id) => {
            socket.leave(room_id);
        });

        // 4. Start Typing
        socket.on('start-typing', (room_id) => {
            socket.to(room_id).emit('users-typing');
        });

        // 5. Stop Typing
        socket.on('stop-typing', (room_id) => {
            socket.to(room_id).emit('stop-typinggggg');
        });

        // 6. Send Messages
        socket.on('send-message', async ({ msg, msg_type, sender_id, room_id }) => {
            const data = await authPromise;
            if (!data) return;

            const res: any = await handle_Send_Msg(msg, msg_type, sender_id, room_id);
            if (res?.msg_Id) {
                io.to(room_id).emit('receive-msg', res.msg_Id, res.mesg, sender_id, room_id);
            }
        });

        // 7. Client reports instant read state
        socket.on('msg_seen_instantly', async ({ msg_Id, room_id }) => {
            const data = await authPromise;
            if (!data) return;

            await instantMsg_Seen(msg_Id, socket);
            socket.to(room_id).emit('update_seen', msg_Id);
        });

        // 8. Media
        socket.on('send-media', async (data) => {
            const auth = await authPromise;
            if (!auth) return;

            const { msg_id, roomId, sender_Id, media_URL, media_Type } = data;
            io.to(roomId).emit('receive-media', msg_id, sender_Id, media_URL, media_Type, roomId);
        });

        // 9. Audio Calling (WebRTC)
        socket.on('audio-call-invite', async (room_id, Prov_callerId, call_id, callee_Id) => {
            const auth = await authPromise;
            if (!auth) return;

            const calleeId = await hanlde_otherUserId(call_id, callee_Id);
            if (!calleeId) return;
            emitToUser(io, calleeId, 'incomming-audio-call', room_id, Prov_callerId, call_id);
        });

        socket.on('reject-audio-call', async (roomId, otherUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, otherUserId);
            if (!result) return;
            emitToUser(io, result.callerId, 'reject-audio-called', roomId, otherUserId);
        });

        socket.on('end-audio-call', async (roomId, otherUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, otherUserId);
            if (!result) return;
            emitToUser(io, result.callerId, 'end-audio-called', roomId);
            emitToUser(io, result.calleeId, 'end-audio-called', roomId);
        });

        socket.on('accept-audio-call', async (roomId, reciverId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, reciverId);
            if (!result) return;
            emitToUser(io, result.callerId, 'audio-call-accepted', roomId, reciverId);
            emitToUser(io, result.calleeId, 'audio-call-accepted', roomId, reciverId);
        });

        socket.on('audio-call-offer', async (offer, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'Offer-audio-call', offer, roomId);
            } else {
                socket.to(roomId).emit('Offer-audio-call', offer, roomId);
            }
        });

        socket.on('answer-audio-call', async (answer, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'answered-audio-call', answer, roomId);
            } else {
                socket.to(roomId).emit("answered-audio-call", answer, roomId);
            }
        });

        socket.on('Audio-call-Connected', async (roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'connected-audio-call');
            } else {
                io.to(roomId).emit("connected-audio-call");
            }
        });

        socket.on('ice-candidate', async (candidate, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'ice-candidate2', candidate);
            } else {
                socket.to(roomId).emit('ice-candidate2', candidate);
            }
        });

        socket.on('audio-call-mute', (roomId) => {
            socket.to(roomId).emit('muted-audio');
        });

        socket.on('audio-call-unmute', (roomId) => {
            socket.to(roomId).emit('unmuted-audio');
        });

        socket.on('AudioCall-not-reached', async (roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'AudioCall-not-reached', roomId);
            } else {
                socket.to(roomId).emit('AudioCall-not-reached', roomId);
            }
        });

        // 10. Video Call - WebRTC
        socket.on('video-call-invite', async (room_id, Prov_callerId, call_id, callee_Id) => {
            const auth = await authPromise;
            if (!auth) return;

            const calleeId = await hanlde_otherUserId(call_id, callee_Id);
            if (!calleeId) return;
            emitToUser(io, calleeId, 'incomming-video-call', room_id, Prov_callerId, call_id);
        });

        socket.on('reject-video-call', async (roomId, otherUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, otherUserId);
            if (!result) return;
            emitToUser(io, result.callerId, 'reject-video-called', roomId, otherUserId);
        });

        socket.on('accept-video-call', async (roomId, reciverId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, reciverId);
            if (!result) return;
            emitToUser(io, result.callerId, 'video-call-accepted', roomId, reciverId);
            emitToUser(io, result.calleeId, 'video-call-accepted', roomId, reciverId);
        });

        socket.on('video-call-offer', async (offer, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'Offer-video-call', offer, roomId);
            } else {
                socket.to(roomId).emit('Offer-video-call', offer, roomId);
            }
        });

        socket.on('answer-video-call', async (answer, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'answered-video-call', answer, roomId);
            } else {
                socket.to(roomId).emit("answered-video-call", answer, roomId);
            }
        });

        socket.on('video-call-Connected', async (roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'connected-video-call');
            } else {
                io.to(roomId).emit("connected-video-call");
            }
        });

        socket.on('ice-candidate-video', async (candidate, roomId, targetUserId) => {
            const auth = await authPromise;
            if (!auth) return;

            if (targetUserId) {
                emitToUser(io, targetUserId, 'ice-candidate-video', candidate);
            } else {
                socket.to(roomId).emit('ice-candidate-video', candidate);
            }
        });

        socket.on('video-call-mute', (roomId) => {
            socket.to(roomId).emit('muted-video');
        });

        socket.on('video-call-unmute', (roomId) => {
            socket.to(roomId).emit('unmuted-video');
        });

        socket.on('end-video-call', async (roomId, reciverId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, reciverId);
            if (!result) return;
            emitToUser(io, result.callerId, 'end-video-called', roomId);
            emitToUser(io, result.calleeId, 'end-video-called', roomId);
        });

        socket.on('disconnect-the-call', (roomId) => {
            socket.to(roomId).emit('disconnect-the-call');
        });

        socket.on('VideoCall-not-reached', async (roomId, reciverId) => {
            const auth = await authPromise;
            if (!auth) return;

            const result = await Give_usersId(roomId, reciverId);
            if (!result) return;
            emitToUser(io, result.calleeId, 'VideoCall-not-reached', roomId);
        });

        // 11. Disconnect Socket
        socket.on("disconnect", async () => {
            const data = await authPromise;
            const userId = data?.userId || socket.data.user?.userId;

            if (userId) {
                const userSockets = userSocketMap.get(userId);
                if (userSockets) {
                    userSockets.delete(socket.id);
                    if (userSockets.size === 0) {
                        userSocketMap.delete(userId);
                        try {
                            const user_model = (await import('../model/user_schema')).default;
                            await user_model.findByIdAndUpdate(userId, { Active_Status: false });
                        } catch (e) {
                            console.error("Error setting user offline:", e);
                        }
                    }
                }
            }
            await disconnect_socket(socket);
        });
    });
};

export default setupSockets;

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
//     10 Loads All OLD Chat messages in room ✅
//     11 Calling Feature Done [ Audio / Video ]✅
//     12 Call History Feature Done! ✅


//Last Feature -
// I want that, incoming audio/video call arives when user is online in app!
// Right now, Call is coming only when user is present in the Chat Room!

// Solution =>
// I am thinking to map [ userId = SocketId ]
//  1st => I got invite-audio/video
//  2nd => I will get the socketId from Map() by giving userId
//  3rd => Send event like this io.to(socketId).emit(...)

//Bug => Now i have these problem too
// Whenever user refresh the page of chat_room, it connects with sockets!
// Its oky! Flow is like 👇
// 1 User is Authenticated!
// 2 These users is connect with sockets =>  new ObjectId('69e75fb59750657a5ab354c0')
// 3 User Enter iN Room! new ObjectId('69e75fb597dfcgvhbjn0')

// But when user refresh chat_room again, it connect with sockets evertime as i want!
// and its flow like this, 
// 1. User is Authenticated!
// 2.These users is connect with sockets =>  new ObjectId('69e75fcfgyuy7t654c0')

//Problem is that users is not entering in the room after refresh page by it self! User doing back and come in room for proper functioning!