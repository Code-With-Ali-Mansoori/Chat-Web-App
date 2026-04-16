import { Phone, House, MessageCircleMore, Power } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useLogout } from "../Hooks/Logout.Hook";

const Footer_navigater = () => { 
  
  const navigator =  useNavigate();
  const {mutate} = useLogout();

  return (
    <div className="md:hidden w-full absolute bottom-0 left-0 border-t border-gray-300 py-3 px-8 sm:px-20">
        <div className='flex gap-5 justify-between items-center max-w-md mx-auto'>
                        <div onClick={() => {navigator('/')}} className='flex flex-col justify-center items-center'>
                        <House size={20} strokeWidth={1.5} />
                        <small className=''>Home</small>
                        </div>

                        <div onClick={() => {navigator('/my-chats')}} className='flex flex-col justify-center items-center'>
                        <MessageCircleMore size={20} strokeWidth={1.5} />
                        <small>Chats</small>
                        </div>

                        <div onClick={() => {navigator('/call-history')}}  className='flex flex-col justify-center items-center'>
                        <Phone size={20} strokeWidth={1.5} />
                        <small>Recent</small>
                        </div>

                        <div onClick={() => mutate()} className='flex flex-col  justify-center hover:text-red-600 items-center'>
                            <Power size={18} strokeWidth={1.5} />
                            <small>Logout</small>
                        </div>
        </div>
    </div>
  )
}

export default Footer_navigater
