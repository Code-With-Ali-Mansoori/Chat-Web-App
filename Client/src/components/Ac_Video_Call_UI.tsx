import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useSocket } from "../Hooks/Sockets";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOtherUser from "../Hooks/useOtherUser";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { IoMdMicOff } from "react-icons/io";  
import { useUnloadWarning } from "../Hooks/useUnloadWarning";
import useSearch from "../Hooks/SearchContext.hook";
import { handle_Call_Update } from "../helper/Update_call";

export default function VideoCallUI() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCall_Start, setIsCall_Start] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);
  const [isOtherMuted, setIsOtherMuted] = useState<boolean>(false);

  const {callId, setCallId} = useSearch();
  const socket = useSocket();
  useUnloadWarning();

  const navigators =  useNavigate();
  const [searchParams] = useSearchParams();
  const user_Id = searchParams.get("Called-User-Id") as string;
  const roomId = searchParams.get("roomId") as string;
    
  const { data : Other_UserData } = useOtherUser(user_Id);
  const { data : myProfile } = useProfile_Hooks();

  // ⏱️ Timer
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const intervalRef = useRef<number | null>(null);
  const callEndTimeoutRef = useRef<number | null>(null);
  const isCallStartRef = useRef<boolean>(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isOfferSetRef = useRef(false);
  const isRemoteDescriptionSetRef = useRef(false);
  const iceCandidateQueueRef = useRef<RTCIceCandidate[]>([]);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const RemoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const hanlde_WebRTC_Connection = () => {
        const peer = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject"
            }
          ]
        });
  
        return peer;  
  };
  
  const createPC = useCallback(async () => {
    if (!pcRef.current) {
      const pc = hanlde_WebRTC_Connection();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
          const remoteStream = event.streams[0];
          // console.log('Remote stream received:', remoteStream);
          
          if (RemoteVideoRef.current) {
            RemoteVideoRef.current.srcObject = remoteStream;
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate-video", event.candidate, roomId);
          }
        };

        // pc.onconnectionstatechange = () => {
        //   console.log('Connection state:', pc.connectionState);
        // };

        pcRef.current = pc;

      } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Unable to access camera or microphone. Please check permissions.");
        return null;
      }
    }

    return pcRef.current;
  }, [roomId, socket]);

  // console.log(Other_UserData?.userAvatar)

  const handle_Reject_VideoCall = useCallback(() => {
    //roomId: string, otherUserId: string
      navigators(-1); ///chat-room?roomId=${roomId}&otherUser-public_Id=${otherUserId}
  }, [navigators]);

  useEffect(() => {
    isCallStartRef.current = isCall_Start;
  }, [isCall_Start]);

  const clearCallEndTimeout = useCallback(() => {
    if (callEndTimeoutRef.current !== null) {
      clearTimeout(callEndTimeoutRef.current);
      callEndTimeoutRef.current = null;
    }
  }, []);


  const handle_Accpeted_VideoCall = useCallback(async (roomId: string, reciverId: string) => {
    clearCallEndTimeout();
    setIsCall_Start(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const pc = await createPC();

    if (pc && reciverId !== myProfile?.message.data.public_Id) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      isOfferSetRef.current = true;
      socket.emit('video-call-offer', offer, roomId, reciverId);
    }
  }, [myProfile?.message.data.public_Id, createPC, socket, clearCallEndTimeout]);


  const handle_End_VideoCall = useCallback( async (roomId: string) => {

    if ( callId && seconds && isCall_Start ) {
          await handle_Call_Update(seconds.toString(), isCall_Start, callId);
    };

    clearCallEndTimeout();
    setIsCall_Start(false);
    setCallId(null);
    isOfferSetRef.current = false;
    isRemoteDescriptionSetRef.current = false;
    iceCandidateQueueRef.current = [];
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    localStreamRef.current?.getTracks().forEach(track => track.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
 
    console.log('End Video Call');
  
    navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
  }, [navigators, Other_UserData?.user_publicId, clearCallEndTimeout,seconds, isCall_Start, callId, setCallId]);


  const handle_Offer_VideoCall = useCallback(async (offer: RTCSessionDescriptionInit, roomId: string) => {
    const pc = await createPC();
    if (!pc) return;
    
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      isRemoteDescriptionSetRef.current = true;
      
      // Process any queued ICE candidates
      while (iceCandidateQueueRef.current.length > 0) {
        const candidate = iceCandidateQueueRef.current.shift();
        if (candidate) {
          try {
            await pc.addIceCandidate(candidate);
          } catch (error) {
            console.warn("Error adding queued ICE candidate:", error);
          }
        }
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer-video-call", answer, roomId, Other_UserData?.user_Id);
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  }, [createPC, socket, Other_UserData?.user_Id]);


  const hanlde_Answered_VideoCall = useCallback(async (answer: RTCSessionDescriptionInit, roomId: string, reciverId : string) => {
    const pc = pcRef.current;
    if (!pc) return;

    if (!isOfferSetRef.current) {
      console.warn("Offer not set yet, cannot set answer. Waiting...");
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      isRemoteDescriptionSetRef.current = true;
      
      // Process any queued ICE candidates
      while (iceCandidateQueueRef.current.length > 0) {
        const candidate = iceCandidateQueueRef.current.shift();
        if (candidate) {
          try {
            await pc.addIceCandidate(candidate);
            // console.log(candidate);
            
          } catch (error) {
            console.warn("Error adding queued ICE candidate:", error);
          }
        }
      }
      
      socket.emit('video-call-Connected', roomId, reciverId);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }, [socket]);


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
          console.log('Call Cut!');
          socket.emit('VideoCall-not-reached', roomId, Other_UserData?.user_Id);
          navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
        }
      }, 10000);
    };

  }, [navigators, Other_UserData?.user_publicId, Other_UserData?.user_Id, socket, clearCallEndTimeout]);


  // Socket listeners setup - only depends on stable values
  useEffect(() => {

    handle_CallENDUp_Timer(roomId);

    socket.emit('join-room', roomId);
    socket.on('reject-video-called', handle_Reject_VideoCall);
    socket.on('end-video-called', handle_End_VideoCall);
    socket.on('video-call-accepted', handle_Accpeted_VideoCall);
    socket.on('Offer-video-call', handle_Offer_VideoCall);
    socket.on('answered-video-call', hanlde_Answered_VideoCall);

    socket.on('connected-video-call', () => {
      console.log('Video Call Happening...'); 
    });

    socket.on("ice-candidate-video", async (candidate) => {
      if (pcRef.current && candidate) {
        try {
          // If remote description isn't set yet, queue the candidate
          if (!isRemoteDescriptionSetRef.current) {
            iceCandidateQueueRef.current.push(new RTCIceCandidate(candidate));
            // console.log("ICE candidate queued, waiting for remote description");
          } else {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    socket.on('muted-video', () => {
        setIsOtherMuted(true);
    });

    socket.on('unmuted-video', () => {
        setIsOtherMuted(false);
    });

    socket.on('disconnect-the-call', hanlde_Disconnect_Call);

    return () => {
      clearCallEndTimeout();
      socket.off('reject-video-called', handle_Reject_VideoCall);
      socket.off('end-video-called', handle_End_VideoCall);
      socket.off('video-call-accepted', handle_Accpeted_VideoCall);
      socket.off('Offer-video-call', handle_Offer_VideoCall);
      socket.off('answered-video-call', hanlde_Answered_VideoCall);
      socket.off('disconnect-the-call', hanlde_Disconnect_Call);
      socket.off('ice-candidate-video');
      socket.off('muted-audio');
      socket.off('unmuted-audio');
      socket.off('connected-video-call')
    };
  }, [handle_Reject_VideoCall, roomId, socket, handle_Accpeted_VideoCall, handle_End_VideoCall, handle_Offer_VideoCall, hanlde_Answered_VideoCall, hanlde_Disconnect_Call, handle_CallENDUp_Timer, clearCallEndTimeout]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const Handle_End_Video_Call = (roomId : string ) => {
      socket.emit('end-video-call', roomId , myProfile?.message.data.public_Id ); //Call Ender Id
  };

  const handle_Mute = () => {

    const newMuted = !isMuted; 
    setIsMuted(newMuted);

    if (newMuted === true) {
      localStreamRef.current?.getAudioTracks().forEach(track => {
        track.enabled = false; // MUTE
      });

      socket.emit('video-call-mute', roomId);

    } else {
      localStreamRef.current?.getAudioTracks().forEach(track => {
        track.enabled = true; // UNMUTE
      });

      socket.emit('video-call-unmute', roomId);
    }
  };

  // const toggleMic = () => {
  //   const newMuted = !isMuted;
  //   setIsMuted(newMuted);
  //   localStreamRef.current?.getAudioTracks().forEach(track => track.enabled = !newMuted);
  // };

  const toggleCamera = () => {
    const newCameraOn = !isCameraOn;
    setIsCameraOn(newCameraOn);
    localStreamRef.current?.getVideoTracks().forEach(track => track.enabled = newCameraOn);
  };

  return (
    <div className="h-screen w-full bg-[#2f3147] flex flex-col text-white overflow-hidden">

      {/* 🔷 HEADER */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#545454]">

        <div className="flex justify-center items-center gap-2 md:gap-3">
          <div className="h-8 w-8 md:h-10 md:w-10 mt-1">
            <img className="rounded-full" src={Other_UserData?.userAvatar} alt="user_avatar" />
          </div>

          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold">
            {Other_UserData?.username}
          </h2>
          <p className="text-xs text-gray-300">
           {isCall_Start ? formatTime(seconds) : Other_UserData?.active_status ? 'Ringing...' : 'Calling...'}
          </p>
          {/* <p className="text-[10px] text-red-300 mt-1">
            Reload karoge to video call disconnect ho jayega. Please use the End button.
          </p> */}
          </div>
          
        </div>

        <div className="flex justify-center items-center gap-6">
          {isOtherMuted ? <IoMdMicOff /> : ''}
          {/* <div className="flex justify-center items-center gap-1">
            
          </div> */}
          
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* 🎥 MAIN */}
      <div className="flex-1 relative">

        {/* 👤 REMOTE VIDEO */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video ref={RemoteVideoRef} autoPlay className="w-full h-full object-cover" />
        </div>

        {/* 🧍 SELF VIDEO */}
        <div className="
          absolute 
          bottom-24 sm:bottom-6 
          right-3 sm:right-6 
          w-20 h-28 
          sm:w-24 sm:h-32 
          md:w-28 md:h-40 
          bg-gray-900 
          rounded-lg sm:rounded-xl 
          overflow-hidden 
          border border-gray-600 
          flex items-center justify-center
        ">
          {/* Replace with local video */}
          <video ref={localVideoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>

      {/* ⚫ FOOTER */}
      <div className="bg-gray-300 py-4 sm:py-5 flex justify-center items-center gap-4 sm:gap-6 md:gap-8">

        {/* 🎙️ Mute */}
        <button
          onClick={handle_Mute}
          className={`p-3 sm:p-4 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* 📷 Camera */}
        <button
          onClick={toggleCamera}
          className={`p-3 sm:p-4 rounded-full ${
            !isCameraOn ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>

        {/* 🔴 End */}
        <button onClick={() => Handle_End_Video_Call(roomId as string)}  className="p-3 sm:p-4 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}