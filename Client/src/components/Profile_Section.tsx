import { Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import useProfile_Hooks from '../Hooks/Profile.Hook';
import { copyUserId, shortenId } from '../helper/Copy';
import { capitalizeFirstLetter } from '../helper/LetterFirst';

const Profile_Section = () => {

  const navigator =  useNavigate();
  const { data } = useProfile_Hooks();

  //isLoading && setLoad(true); //Access by REDUX   

  return (
    <> 
    { data?.message?.data &&  
    <div className='pl-2'>
      <div className='h-full sm:px-4 px-1 md:px-7 flex justify-center items-center gap-3 '>
                    <div onClick={() => {navigator('/profile')}} 
                    className={`h-10 w-10 cursor-pointer border border-gray-300 rounded-full`}>
                      <img className="h-full w-full rounded-full" src={data?.message?.data?.avatar} alt="" />
                    </div>

                    <div className='hidden sm:flex flex-col justify-center'>
                        <span onClick={() => {navigator('/profile')}} className='cursor-pointer font-mono'>{
                        capitalizeFirstLetter(data?.message?.data?.username)}</span>
                        <div className='flex cursor-pointer justify-center items-center gap-2'>
                            <small className='font-mono'>
                              { shortenId(data?.message?.data?.public_Id) }
                            </small>
                            <Copy onClick={() => copyUserId(data?.message?.data?.public_Id)}  size={12} strokeWidth={1} className='hover:text-gray-400 hover:cursor-pointer'/>
                        </div>
                    </div>  
      </div>
    </div>}
    </>
  )
}

export default Profile_Section
