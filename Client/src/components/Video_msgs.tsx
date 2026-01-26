import { useState } from "react";

const Video_msgs = () => {

  const [isMine, setIsMine] = useState<boolean>(false);

  return (
    <div className="w-full h-fit py-2 ">
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}  w-full justify-center gap-3`}>
            <div className={`md:h-8 ${isMine ? 'hidden' : 'block'} mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>
            
            <div className={`border ${isMine ? 'md:ml-14 ml-8 lg:ml-30' : 'md:mr-14 mr-8 lg:mr-30'} border-gray-300 bg-gray-100 rounded-2xl`}>
              <a href="https://www.pexels.com/download/video/35570103/" target="_blank" rel="noopener noreferrer"
              className="block md:w-80 md:h-40 w-48 h-28 cursor-pointer">
                <video src="https://www.pexels.com/download/video/35570103/"  loop  controls className="h-full w-full rounded-t-2xl object-cover"/>
              </a>
              <small className={`${isMine ? "justify-start" : "justify-end"}  p-2 flex justify-end w-full items-center text-right`} >08:33 pm</small>
            </div>

            <div className={`md:h-8 ${isMine ? 'block' : 'hidden'} mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>
        </div>
    </div>
  )
}

export default Video_msgs;