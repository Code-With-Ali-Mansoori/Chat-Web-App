import { Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const Profile_Section = () => {

  const navigator =  useNavigate();

  return (
    <>
      <div className='h-full sm:px-4 px-1 md:px-7 flex justify-center items-center gap-3 '>
                    <div onClick={() => {navigator('/user/profile')}} className="h-10 w-10 bg-[url('https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')] bg-cover bg-center cursor-pointer"></div>

                    <div className='hidden sm:flex flex-col justify-center'>
                        <span onClick={() => {navigator('/user/profile')}} className='cursor-pointer'>Ali_Mansoori123</span>
                        <div className='flex cursor-pointer justify-center items-center gap-2'>
                            <small className='font-mono'>oiy_t12fg07bjlm98_jL </small>
                            <Copy size={12} strokeWidth={1} className='hover:text-gray-400 hover:cursor-pointer'/>
                        </div>
                    </div>  
        </div>
    </>
  )
}

export default Profile_Section
