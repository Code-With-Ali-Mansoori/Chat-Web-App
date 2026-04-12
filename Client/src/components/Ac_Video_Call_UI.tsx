import { useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function VideoCallUI() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  // ⏱️ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="h-screen w-full bg-[#2f3147] flex flex-col text-white overflow-hidden">

      {/* 🔷 HEADER */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#545454]">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold">
            Name Surname
          </h2>
          <p className="text-xs text-gray-300">
            {/* {formatTime(seconds)} */}
            Calling
          </p>
        </div>

        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>

      {/* 🎥 MAIN */}
      <div className="flex-1 relative">

        {/* 👤 REMOTE VIDEO */}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          {/* Replace with real video */}
          <span className="text-gray-500 text-xs sm:text-sm">
            Remote Video
          </span>
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
          <span className="text-[10px] sm:text-xs text-gray-400">
            You
          </span>
        </div>
      </div>

      {/* ⚫ FOOTER */}
      <div className="bg-gray-300 py-4 sm:py-5 flex justify-center items-center gap-4 sm:gap-6 md:gap-8">

        {/* 🎙️ Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 sm:p-4 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* 📷 Camera */}
        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`p-3 sm:p-4 rounded-full ${
            !isCameraOn ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>

        {/* 🔴 End */}
        <button className="p-3 sm:p-4 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}