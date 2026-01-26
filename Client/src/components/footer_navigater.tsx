import { Bot, House, MessageCircleMore, Power } from "lucide-react"

const Footer_navigater = () => {    
  return (
    <div className="md:hidden w-full absolute bottom-0 left-0 border-t border-gray-300 py-3 px-8 sm:px-20">
        <div className='flex gap-5 justify-between items-center max-w-md mx-auto'>
                        <div className='flex flex-col justify-center items-center'>
                        <House size={20} strokeWidth={1.5} />
                        <small className=''>Home</small>
                        </div>

                        <div className='flex flex-col justify-center items-center'>
                        <MessageCircleMore size={20} strokeWidth={1.5} />
                        <small>Chats</small>
                        </div>

                        <div className='flex flex-col justify-center items-center'>
                        <Bot size={20} strokeWidth={1.5} />
                        <small>AI</small>
                        </div>

                        <div className='flex flex-col justify-center items-center'>
                            <Power size={18} strokeWidth={1.5} />
                            <small>Logout</small>
                        </div>
        </div>
    </div>
  )
}

export default Footer_navigater
