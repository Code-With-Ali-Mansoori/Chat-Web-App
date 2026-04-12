import { Phone, PhoneOff, Video } from "lucide-react";

export default function IncomingVideoCall() {
  return (
    <div className="h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden relative">

      {/* 🎥 BACKGROUND (Remote Preview / Placeholder) */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Incoming Video...</span>
      </div>

      {/* 🔵 MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10 gap-3">

        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          Name Surname
        </h2>

        <p className="text-xs sm:text-sm text-gray-300">
          Incoming Video Call...
        </p>

        {/* Optional camera icon */}
        <Video className="mt-2 text-gray-300" size={28} />
      </div>

      {/* 🧍 SELF PREVIEW (optional) */}
      <div className="
        absolute 
        top-4 right-4 
        w-20 h-28 
        sm:w-24 sm:h-32 
        bg-gray-800 
        rounded-lg 
        flex items-center justify-center 
        border border-gray-600
      ">
        <span className="text-[10px] text-gray-400">You</span>
      </div>

      {/* ⚫ FOOTER */}
      <div className="relative z-10 bg-black/80 backdrop-blur py-6 flex justify-center items-center gap-10 pb-[env(safe-area-inset-bottom)]">

        {/* ❌ Decline */}
        <button className="p-5 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={22} />
        </button>

        {/* ✅ Accept */}
        <button className="p-5 rounded-full bg-green-600 hover:bg-green-700">
          <Phone size={22} />
        </button>
      </div>
    </div>
  );
}