import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOtherUser from "../Hooks/useOtherUser";
import { useSocket } from "../Hooks/Sockets";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { useUnloadWarning } from "../Hooks/useUnloadWarning";
import useSearch from "../Hooks/SearchContext.hook";
import { handle_Call_Update } from "../helper/Update_call";

export default function AudioCallUI() {
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isOtherMuted, setIsOtherMuted] = useState<boolean>(false);
  const [isCall_Start, setIsCall_Start] = useState<boolean>(false);

  const {callId, setCallId, setIsCallActive} = useSearch();
  const socket = useSocket();
  useUnloadWarning();  

  const navigators =  useNavigate();
  const [searchParams] = useSearchParams();
  const user_Id = searchParams.get("Called-User-Id") as string;
  const roomId = searchParams.get("roomId") as string;
    
  const { data : Other_UserData } = useOtherUser(user_Id);
  const { data : myProfile } = useProfile_Hooks();

  const intervalRef = useRef<number | null>(null);
  const callEndTimeoutRef = useRef<number | null>(null);
  const isCallStartRef = useRef<boolean>(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isOfferSetRef = useRef(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  // End the Call pe dono user WebRTC connection close ho jay aur mic/camera bhi! = Remaining Feature
  const hanlde_WebRTC_Connection = () => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      return peer;  
  };

  const createPC = useCallback(async () => {
  if (!pcRef.current) {
    const pc = hanlde_WebRTC_Connection()

    // 🎤 Get mic access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    // 🎧 Add tracks to connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // 🔊 Receive remote audio
    pc.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };

    // ❄️ ICE => 2 users ke beech best possible network path find karna
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId, Other_UserData?.userId);
      }
    };

    localStreamRef.current = stream;
    pcRef.current = pc;
  }

  return pcRef.current;
  }, [roomId, socket, Other_UserData?.userId]);


  useEffect(() => {
    isCallStartRef.current = isCall_Start;
  }, [isCall_Start]);


  const clearCallEndTimeout = useCallback(() => {
    if (callEndTimeoutRef.current !== null) {
      clearTimeout(callEndTimeoutRef.current);
      callEndTimeoutRef.current = null;
    }
  }, []);


  const handle_Reject_AudioCall = useCallback(() => {
    // roomId: string, otherUserId: string)
    navigators(-1); //`/chat-room?roomId=${roomId}&otherUser-public_Id=${otherUserId}`
  }, [navigators]);


  const handle_End_AudioCall = useCallback(async (roomId: string) => {

    if ( callId && seconds && isCall_Start ) {
      await handle_Call_Update(seconds.toString(), isCall_Start, callId);
    };

    clearCallEndTimeout();
    setIsCall_Start(false);
    setCallId(null);
    setIsCallActive(false);
    isOfferSetRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    localStreamRef.current?.getTracks().forEach(track => track.stop()); //Closing Mic
    pcRef.current?.close(); //Closing WebRTC connection

    navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);

  },
  [navigators, clearCallEndTimeout, seconds, isCall_Start, callId, setCallId, setIsCallActive, Other_UserData?.user_publicId]);


  const handle_Accpeted_AudioCall = useCallback(async (roomId: string, reciverId: string) => {

    if (!myProfile?.message.data.user_id || !Other_UserData?.userId) {
      console.warn('❌ Profile or Other_UserData not loaded yet, retrying...');
      setTimeout(() => handle_Accpeted_AudioCall(roomId, reciverId), 500);
      return;
    }

    clearCallEndTimeout();
    setIsCall_Start(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    };

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const Pc = await createPC(); //TURN Server Req For Connection

    if ( reciverId !== myProfile?.message.data.user_id ) {
      try {
        const offer = await Pc.createOffer(); //Create SDP offer
        await Pc.setLocalDescription(offer); // Store Offer Locally

        isOfferSetRef.current = true; // ✅ mark ready
        socket.emit('audio-call-offer', offer, roomId, Other_UserData?.userId); //Signaling and Send offer to Callee
      } catch (e) {
        console.error("Error creating/setting audio offer:", e);
      }
    };

  }, [myProfile?.message.data.user_id, createPC, socket, clearCallEndTimeout, Other_UserData?.userId]);


  const handle_Offer_AudioCall = useCallback(async (offer: RTCSessionDescriptionInit, roomId: string) => {

    const pc = await createPC(); // Using same WebRTC connection
    if (pc.signalingState !== "stable") return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer)); // Store Caller Offer Remotely

      const answer = await pc.createAnswer(); // Create Answer
      await pc.setLocalDescription(answer); // Store Remotely

      socket.emit("answer-audio-call", answer, roomId, Other_UserData?.userId); //Signaling and Sharing with Caller
    } catch (e) {
      console.error("Error handling audio offer:", e);
    }
  }, [createPC, socket, Other_UserData?.userId]);


  const hanlde_Answered_AudioCall = useCallback(async (answer: RTCSessionDescriptionInit, roomId: string) => {
    const pc = pcRef.current;
    if (!pc) return;

    // ❗ RACE CONDITION: If answer arrives before setLocalDescription(offer) finishes
    if (!isOfferSetRef.current || pc.signalingState === "stable") {
      console.warn("⏳ Audio answer arrived but offer not yet set. Retrying...");
      setTimeout(() => hanlde_Answered_AudioCall(answer, roomId), 200);
      return;
    }

    if (pc.signalingState !== "have-local-offer") {
      console.warn("Signaling state is not 'have-local-offer'. Current state:", pc.signalingState);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer)); // Store Callee Answer Remotely
      socket.emit('Audio-call-Connected', roomId, Other_UserData?.userId);
    } catch (e) {
      console.error("Error handling audio answer:", e);
    }
  }, [socket, Other_UserData?.userId]);

  const hanlde_Disconnect_Call = useCallback(() => {
      alert('⚠️ Network has Interupted');
      setTimeout(() => {
          navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
          socket.emit('disconnect-the-call', roomId);
      }, 2000);
    }, [Other_UserData?.user_publicId, navigators, roomId, socket]);


    const handle_CallENDUp_Timer = useCallback((roomId : string) => {
      clearCallEndTimeout();

      if (!isCallStartRef.current) {
        callEndTimeoutRef.current = window.setTimeout(() => {
          if (!isCallStartRef.current) {
            socket.emit('AudioCall-not-reached', roomId, Other_UserData?.userId);
            navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
          }
        }, 15000);
      }
    }, [navigators, Other_UserData?.user_publicId, Other_UserData?.userId, socket, clearCallEndTimeout]);


  useEffect(() => {
    handle_CallENDUp_Timer(roomId);

    socket.emit('join-room', roomId);
    socket.on('reject-audio-called', handle_Reject_AudioCall);
    socket.on('end-audio-called', handle_End_AudioCall);
    socket.on('audio-call-accepted', handle_Accpeted_AudioCall);
    socket.on('Offer-audio-call', handle_Offer_AudioCall);
    socket.on('answered-audio-call', hanlde_Answered_AudioCall);

    socket.on("ice-candidate2", async (candidate) => {
        if (pcRef.current && candidate) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {
            console.warn("Error adding ICE candidate:", e);
          }
        }
    });

    socket.on('muted-audio', () => setIsOtherMuted(true));
    socket.on('unmuted-audio', () => setIsOtherMuted(false));
    socket.on('disconnect-the-call', hanlde_Disconnect_Call);

    return () => {
      clearCallEndTimeout();
      socket.off('reject-audio-called', handle_Reject_AudioCall);
      socket.off('end-audio-called', handle_End_AudioCall);
      socket.off('audio-call-accepted', handle_Accpeted_AudioCall);
      socket.off('Offer-audio-call', handle_Offer_AudioCall);
      socket.off('answered-audio-call', hanlde_Answered_AudioCall);
      socket.off('muted-audio');
      socket.off('unmuted-audio');
      socket.off('ice-candidate2');
      socket.off('disconnect-the-call', hanlde_Disconnect_Call);
    };
  }, [socket, roomId, handle_Reject_AudioCall, handle_End_AudioCall, handle_Accpeted_AudioCall, handle_Offer_AudioCall, hanlde_Answered_AudioCall, hanlde_Disconnect_Call, handle_CallENDUp_Timer, clearCallEndTimeout]);


  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const Handle_End_Audio_Call = (roomId : string ) => {
      socket.emit('end-audio-call', roomId , myProfile?.message.data.user_id ); //Call Ender Id
  };

  const handle_Mute = () => {

    const newMuted = !isMuted; 
    setIsMuted(newMuted);

    if (newMuted === true) {
      localStreamRef.current?.getAudioTracks().forEach(track => {
        track.enabled = false; // MUTE
      });

      socket.emit('audio-call-mute', roomId, myProfile?.message.data.public_Id);

    } else {
      localStreamRef.current?.getAudioTracks().forEach(track => {
        track.enabled = true; // UNMUTE
      });

      socket.emit('audio-call-unmute', roomId, myProfile?.message.data.public_Id);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="h-dvh w-full bg-[#242323] flex flex-col justify-between text-white overflow-hidden">

      {/* 🔵 MAIN */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4">

        {/* Avatar */}
        <div className="
  w-24 h-24 
  sm:w-32 sm:h-32 
  md:w-40 md:h-40 
  rounded-full 
  border-2
  overflow-hidden
">
  <img
    src={Other_UserData?.userAvatar}
    alt="avatar"
    className="w-full h-full object-cover"
  />
</div>

        {/* Name */}
        <h2 className="text-sm sm:text-base md:text-lg font-semibold">
          {Other_UserData?.username}
        </h2>

        {/* Timer And Call Status*/}
        <p className="text-xs sm:text-sm text-gray-300">
          {isCall_Start ? formatTime(seconds) : Other_UserData?.active_status ? 'Ringing...' : 'Calling...'}
        </p>
        {/* <p className="text-[10px] sm:text-xs text-red-300 mt-1">
          Page reload karoge to audio call disconnect ho jayega. Please use the End button.
        </p> */}

        {/* Mute Indicator */}
        {isOtherMuted && (
          <div>
            <p className="text-xs sm:text-sm text-gray-400">
              🔇 Muted
            </p>
          </div>
        )}

      </div>

      {/* ⚫ FOOTER */}
      <div className="bg-gray-300 py-5 sm:py-5 flex justify-center items-center gap-4 sm:gap-6 md:gap-8 ">

        {/* 🎙️ Mute */}
        <button
          onClick={handle_Mute}
          className={`p-3 sm:p-4 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* 🔊 Speaker
        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-3 sm:p-4 rounded-full ${
            !isSpeakerOn ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button> */}

        {/* 🔴 End Call */}
        <button onClick={() => Handle_End_Audio_Call(roomId as string)} className="p-3 sm:p-4 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}
