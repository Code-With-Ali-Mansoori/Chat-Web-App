import { useState } from "react";

const Text_Ui = () => {

  const [isMine, setIsMine] = useState<boolean>(true);

  return (
    <div className=" w-full h-fit py-2">
        <div className={`flex ${ isMine ? "justify-end" : "justify-start" } w-full  gap-3`}>
            <div className={`md:h-8 ${isMine ? "hidden" : "block"} hover:cursor-pointer mt-1 md:w-9 h-8 w-9`}>
                    <img className="w-full  border border-gray-100 rounded-full h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>

            <div className={`border  
              ${isMine ? 'ml-12 lg:ml-30 bg-white border-gray-300': "mr-12 lg:mr-30 md:mr-14  bg-gray-100 border-gray-300 "}  
              inline  w-fit md:px-4 py-1 px-3 md:py-2 rounded-2xl`}>
                <small>jbhvgcfx grtdrfvgbhj gytfydrt ot 789olm nhugyuydrxd r6oplm v 78ojhgec59gncdr 9ouihb </small>
                <small className={` pt-1 flex w-full items-center
                  ${isMine ? "justify-start" : "justify-end"} `}>08:33 pm</small>
            </div>

            <div className={`md:h-8 ${isMine ? "block" : "hidden"} hover:cursor-pointer mt-1 md:w-9 h-8 w-9`}>
                    <img className="w-full border border-gray-100 rounded-full h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>

        </div>
    </div>
  )
}

export default Text_Ui;