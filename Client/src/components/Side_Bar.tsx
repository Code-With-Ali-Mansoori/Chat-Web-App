import { Bot, House, MessageCircleMore, Power } from "lucide-react"

const Side_Bar = () => {
  return (
    <>
        <div className="border-r-2 border-gray-400 w-14 h-full p-2 pr-3 hidden md:flex flex-col justify-between items-center">

                <div className='flex flex-col gap-14 justify-between items-center'>
                    <div className=' bg-white'>
                        <img className='rounded border-gray-100' src='/public/image copy.png' alt="App logo" />
                    </div>

                    <div className='flex border-b-2 border-gray-400 pb-4 flex-col gap-7 justify-between items-center'>
                        <div className='flex flex-col cursor-pointer justify-center items-center'>
                        <House size={20} strokeWidth={1.5} />
                        <small className=''>Home</small>
                        </div>

                        <div className='flex flex-col cursor-pointer justify-center items-center'>
                        <MessageCircleMore size={20} strokeWidth={1.5} />
                        <small>Chats</small>
                        </div>

                        <div className='flex flex-col cursor-pointer justify-center items-center'>
                        <Bot size={20} strokeWidth={1.5} />
                        <small>AI</small>
                        </div>
                    </div>
                </div>

                <div className='border-t-2 p-2 cursor-pointer border-gray-400'>
                    <Power size={18} strokeWidth={1.5} />
                </div>
        </div>
    </>
  )
}

export default Side_Bar
