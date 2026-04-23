import Chat_UI from "../components/Chat_UI"
import Left_chatUi from "../components/Left_chatUi"
import Side_Bar from "../components/Side_Bar"

const Chat_page = () => {
  return (
    <div className="flex h-dvh w-full overflow-hidden">
         <Side_Bar/>
         <div className="flex w-full h-full overflow-hidden">
            <div className=" md:w-1/3 hidden md:inline h-full">
                <Left_chatUi/>
            </div>
            <div className=" md:border-l border-gray-500 w-full md:w-2/3 h-full">
                <Chat_UI/>
            </div>
         </div>
    </div>
  )
}

export default Chat_page
