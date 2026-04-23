import { capitalizeFirstLetter } from '../helper/LetterFirst';
import useProfile_Hooks from '../Hooks/Profile.Hook';
import welcome_Illusteration from '../assets/welcome.png';

const Welcome_msg = () => {

  const { data } = useProfile_Hooks();

  return (
    <div className="flex rounded-2xl bg-[url('https://i.pinimg.com/1200x/f7/50/97/f75097d43af0f0541f4e205153d0034d.jpg')] bg-cover bg-center flex-col lg:gap-20 md:gap md:flex-row justify-center  h-full w-full items-center">

      <div className="h-68 animate-float md:hidden w-68 p-9 md:h-80 md:w-80">
        <img src={welcome_Illusteration} alt=" UI_illustration" />
      </div>

      {data?.message?.data &&
        <div className="pb-8 pl-4 lg:pl-5">
          <h1 className="lg:text-4xl md:text-3xl text-2xl font-medium">Welcome to Chatsy!</h1>
          <h3 className='pl-1 pt-1 md:pt-5 lg:text-2xl text-gray-600'>Hey <span className='text-gray-800 font-medium'> {capitalizeFirstLetter(data?.message?.data?.username)}</span> 👋</h3>
          <h3 className="pl-1 text-gray-600 lg:text-2xl">Connect instantly. Chat effortlessly.</h3>
          <h3 className="pl-1 text-gray-600 lg:text-2xl">With encrypted and user privacy concerns. </h3>
        </div>
      }

      <div className="h-80 md:pt-12 animate-float hidden md:block w-80 p-9 md:h-80 lg:w-120 lg:h-120 md:w-80 ">
        <img src={welcome_Illusteration} alt=" UI_illustration" />
      </div>
    </div>
  )
}

export default Welcome_msg;
