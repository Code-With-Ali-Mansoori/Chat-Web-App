import { useState } from "react";

const Image_msgs = () => {

  const [isMine, setIsMine] = useState<boolean>(false);
  
  return (
    <div className="w-full h-fit py-2 ">

        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}  w-full gap-3`}>
            <div className={`${isMine ? 'hidden' : 'block'} hover:cursor-pointer md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>
            
            <div className={`border bg-gray-100 border-gray-300 rounded-2xl ${isMine ? 'md:ml-14 ml-8 lg:ml-30' : 'md:mr-14 mr-8 lg:mr-30'}`}>
              <a href="https://www.pixground.com/wp-content/uploads/2023/02/Mountain-Lake-Reflection-in-Nature-Scenery-4K-Wallpaper.jpg" target="_blank" rel="noopener noreferrer"
              className="block md:w-80 md:h-40 w-48 h-28 cursor-pointer">
                <img src="https://www.pixground.com/wp-content/uploads/2023/02/Mountain-Lake-Reflection-in-Nature-Scenery-4K-Wallpaper.jpg" alt="Shared media" className="h-full w-full rounded-t-2xl object-cover"/>
              </a>
              <div className={`p-2 flex w-full items-center gap-1
                  ${isMine ? "justify-start" : "justify-end"} `}>
                    <small>Image sent at</small>
                    <small>08:33 pm</small>
                  </div>
            </div>

            <div className={`md:h-8 ${isMine ? 'block' : 'hidden'} hover:cursor-pointer mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>

        </div>
    </div>
  )
}

export default Image_msgs
