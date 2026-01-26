import { FolderOpen } from "lucide-react";
import { useState } from "react";

const File_msg = () => {

  const [isMine, setIsMine] = useState<boolean>(true);

  return (
    <div className="w-full flex justify-start h-fit py-2 ">
        <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} gap-3`}>
            
            <div className={`${isMine ? 'hidden' : 'block'} md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>

            <div className={`bg-gray-100 border-gray-300 w-46 rounded-2xl h-16 px-4  border py-2`}>
                <a href="https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf" target="_blank" className="flex  py-1 w-full justify-center items-center gap-3">
                  <FolderOpen strokeWidth={1.25} size={24}/>
                  <h3>Example_file.txt</h3>
                </a>
                <small className={` ${isMine ? "justify-start" : "justify-end"} pb-1 px-1 flex w-full items-center`}>08:33 pm</small>
            </div>

            <div className={`${isMine ? 'block' : 'hidden'} md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png" alt="user_profile_img" />
            </div>

        </div>
    </div>
  )
}

export default File_msg;