import Chat_UI from "../components/Chat_UI"
import Left_chatUi from "../components/Left_chatUi"
import Side_Bar from "../components/Side_Bar"

const Chat_page = () => {
  return (
    <div className="flex h-full w-full">
         <Side_Bar/>
         <div className="flex w-full h-full">
            <div className=" md:w-1/3 hidden md:inline">
                <Left_chatUi/>
            </div>
            <div className=" border-l border-gray-500 w-3/3 md:w-2/3">
                <Chat_UI/>
            </div>
         </div>
    </div>
  )
}

export default Chat_page
