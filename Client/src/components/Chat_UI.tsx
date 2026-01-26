import { ChevronLeft, Images, Phone, SendHorizontal, SmilePlus, Video } from "lucide-react"
// import EmojiPicker from "emoji-picker-react";  // For emoji select
import Text_Ui from "./Text_Ui"
import Image_msgs from "./Image_msg"
import Video_msgs from "./Video_msgs"
import File_msg from "./File_msg"
import { useNavigate } from "react-router-dom"

const Chat_UI = () => {

  const navigator =  useNavigate();
//   const {isEmoji_Click, SetIsEmoji_Click} = useState<boolean>(false);

  return (
    <div className=" h-full  w-full">

        <div className="border-b border-gray-400 flex justify- items-center gap-1 py-3 px-2">
            <div onClick={() => {navigator('/my-chats')}} className="w-fit hover:cursor-pointer"><ChevronLeft strokeWidth={1.5} /></div>
            <div onClick={() => {navigator('/user/profile')}} className="flex items-center  gap-2 w-4/5">
                <div  className="h-10 w-10">
                    <img className="w-full hover:cursor-pointer h-full" src="https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" alt="user_profile_img" />
                </div>
                <div className="flex flex-col ">
                    <small className="font-medium md:hidden hover:cursor-pointer">Ali_Mansoori123</small>
                    <big className="font-medium hidden md:inline hover:cursor-pointer">Ali_Mansoori123</big>
                    <small className="text-left text-green-500">online</small>
                </div>
            </div>
            <div className="flex w-1/5 justify-center items-center gap-4 lg:gap-6 mr-2">     
                    <div className="hover:cursor-pointer"><Phone strokeWidth={1.25} /></div>
                    <div className="hover:cursor-pointer"><Video strokeWidth={1.25} size={28}/></div>
            </div>
        </div>

        <div className="h-4/5 p-3 border-b border-gray-400 chat-scroll2 overflow-y-scroll"> 
             <Text_Ui/>
             <Image_msgs/>
             <Video_msgs/>
             <File_msg/>  
        </div>
{/* 
        {isEmoji_Click && (
        <div className="absolute bg-amber-400 bottom-12 left-0 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              console.log(emojiData.emoji)} />
        </div>
        )} */}

        <div className=" pt h-fit w-full">
            <div className="h-12 pt-3 border-gray-400 rounded-2xl gap-2 px-3 flex justify-evenly items-center mx-2">
                <div className="hover:cursor-pointer"
                    //  onClick={() => {SetIsEmoji_Click(true)}} 
                >
                    <SmilePlus className="text-gray-500" strokeWidth={1.25} />
                </div>

                <input type="text" className="border mx-2 border-gray-400  focus:outline-none rounded  p-2 pl-2 w-4/5" placeholder="message..."/>

                <div className=" flex justify-center items-center gap-3">
                    <div><Images className="text-gray-500 hover:cursor-pointer" strokeWidth={1.25} /></div>
                    <div className="flex hover:cursor-pointer justify-center items-center gap-2 border px-2 py-1 border-gray-400  rounded md:rounded-2xl">
                        <button>Send </button>
                        <SendHorizontal className="sm:inline hidden text-gray-500" strokeWidth={1.25} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chat_UI
