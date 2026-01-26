import { SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';

const Profile_Setup_pg = () => {

  const [Isuser_avatar, setIsUser_avatar] = useState<boolean>(false);
  // const [user_avatar, setUser_avatar] = useState<string | null>(null);

  useEffect(() => {
    // setUser_avatar('https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png');

    // console.log(user_avatar);
    
    setIsUser_avatar(true);
  }, [Isuser_avatar])
  
  return (
    <div className=" flex bg-gray-300 flex-col gap-10 items-center h-fit p-3 pb-20">

      <h1 className="font-mono text-3xl mt-8 lexend-exa ">Profile Setup</h1>

      <form action="" className="flex border-white bg-white flex-col sm:text-center gap-4 p-6 pt-10 rounded-2xl sm:w-3/5">

      <label className="flex justify-center mb-4">
        <div className={`"border relative p-2 border-gray-600 focus:outline-0 rounded-full h-24 w-24 
        ${ Isuser_avatar ? `bg-[url('https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')]` : "bg-[url('https://tse1.mm.bing.net/th/id/OIP.Sdwk-7MkBK1c_ap_eGCwxwHaHa?pid=Api&P=0&h=180')]"}

         bg-cover bg-center"`}>
            <SquarePen size={16} strokeWidth={2} className="absolute bottom-0 text-gray-900 right-3"/>
          <input type="file" className="hidden"/>
        </div>
      </label>
        
        <label className='text-left sm:pl-6 lg:pl-12'>
          <span className="text-left align-baseline">Email : </span>
          <input className="border p-2 shrink focus:outline-0 sm:mt-0 mt-1 md:ml-11 pl-2 rounded sm:w-3/4 w-full" readOnly type="text" placeholder="🚫 alimansoori121@gmail.com "/>
       </label>

       <label className="text-left sm:pl-6 lg:pl-12">
          <span className="text-left align-baseline">Username : </span>
          <input className="border pl-2 p-2 shrink focus:outline-0 sm:mt-0 mt-1 md:ml-3  rounded sm:w-3/4 w-full" type="text" placeholder="Enter Username..."/>
       </label>

       <label className="text-left sm:pl-6 lg:pl-12">
          <span className="text-left align-baseline">Gender : </span>
          {/* <input className="border p-2 shrink focus:outline-0 sm:mt-0 mt-1 sm:ml-3 pl-1  rounded sm:w-3/4 w-full" type="text" placeholder="Enter Username..."/> */}
          <select className="border rounded sm:ml-8 p-2 ml-2" name="user-gender" >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
          </select>
       </label>

       <label className="text-left sm:pl-6 lg:px-12">
          <span className="text-left ">Bio : </span>
          <textarea className="border p-2 shrink focus:outline-0 h-22  mt-2 pl-2 rounded  w-full" placeholder="User's Interested Info.."/>
       </label>

        {/* <label className="">
          <span className="text-left align-baseline">Username : </span>
          <input className="border p-2 shrink focus:outline-0 sm:mt-0 mt-1 sm:ml-3 pl-1 rounded sm:w-3/4 w-full" type="text" placeholder="Enter Username..."/>
       </label> */}

       <button type="submit" className="border bg-gray-600 font-medium text-white mx-auto mt-3 w-fit px-4 py-2 rounded">Done</button>   

      </form>
      
    </div>
  )
}

export default Profile_Setup_pg
