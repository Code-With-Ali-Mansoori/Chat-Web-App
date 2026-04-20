import { SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface User_Provided_Data {
  avatar : string,
  email : string
}

type Typed_Form_Data = {
  username: string;
  gender: string;
  user_Bio: string;
  user_avatar : FileList
}

const Profile_Setup_pg = () => {

  //User's Gender is not selecting! an Bug
  const navigator = useNavigate();
  const [user_data, setUser_data] = useState<User_Provided_Data | null>();
  const {register, handleSubmit, formState: { errors }} = useForm<Typed_Form_Data>();

  const Handle_User_Provider_Data = async () : Promise<void> => {
      try {
        const res = await axios.get('https://chatsy-y2s8.onrender.com/init/user/profile', {withCredentials : true});

        if (res.status === 200) {

        setUser_data({
          avatar : res.data.message.data.avatar,
          email : res.data.message.data.email
        })}; 
        
      } catch (error) {
        console.log(error);     
      }
  };

  useEffect(() => {
    Handle_User_Provider_Data();
  }, []);

  const MutationHandler = async (form_Data : FormData) => {
    try {
        
      const resp = await axios.put('https://chatsy-y2s8.onrender.com/user/profile/setup', form_Data, {withCredentials : true});

      if( resp.status === 200 ){
        
        alert('Profile Setup is Done! ✅');
        navigator('/');
        return;
      };

    } catch (error) {
      console.log(error);
    }
  };

  const send_ProfileData = useMutation({
    mutationFn : (formData : FormData ) => MutationHandler(formData),
    onError : () => console.log('Something wrong in Mutation Hanlder or server!')
  });

  const Profile_Setup_Handler = (data : Typed_Form_Data) => {
    const formData = new FormData(); 

    formData.append("user_avatar", data.user_avatar[0]);
    formData.append("username", data.username);
    formData.append("gender", data.gender);
    formData.append("user_Bio", data.user_Bio);

    send_ProfileData.mutate(formData);    
  };
  
  return (
    <div className=" flex bg-gray-100 flex-col gap-10 items-center h-fit p-3 pb-20">
      <h1 className="font-mono text-3xl mt-8 lexend-exa ">Profile Setup</h1>

      <form 
      encType="multipart/form-data" 
      method='PUT' 
      action='https://chatsy-y2s8.onrender.com/user/profile/setup' 
      onSubmit={handleSubmit(Profile_Setup_Handler)}  
      className="flex border-white bg-white flex-col sm:text-center gap-4 p-6 pt-10 rounded-2xl sm:w-3/5">

      <label className="flex justify-center mb-4">
        
        <div  className="border relative  p-2 border-gray-500 focus:outline-0 rounded-full h-24 w-24 hover:cursor-pointer"
        style={{ 
          backgroundSize: 'cover',  
          backgroundPosition: 'center', 
          backgroundRepeat: "no-repeat" ,
          backgroundImage: `url(${ user_data?.avatar ? user_data.avatar: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
          })`
        }}>
            
            <SquarePen size={16} strokeWidth={2} className="absolute bottom-0 text-gray-900 right-3"/>
            <input {...register('user_avatar')}  accept="image/*" type="file" className="hidden"/>
        </div>
      </label>
        
        <label className='text-left sm:pl-6 lg:pl-12'>
          <span className="text-left align-baseline">Email : </span>
          <input className="border p-2 shrink focus:outline-0 sm:mt-0 mt-1 md:ml-11 pl-2 rounded sm:w-3/4 w-full " readOnly type="text" placeholder={` 🚫 ${user_data?.avatar ? user_data.email: 'not provided'}`}/>
       </label>

       <label className="text-left sm:pl-6 lg:pl-12">
          <span className="text-left align-baseline">Username : </span>
          <input {...register('username', { required: true })} className="border hover:cursor-pointer  pl-2 p-2 shrink focus:outline-0 sm:mt-0 mt-1 md:ml-3  rounded sm:w-3/4 w-full" name='username' type="text" placeholder="Enter Username..."/>
          {errors.username && <small className='text-red-600 block mt-2'>This field is required</small>}
       </label>

       <label className="text-left sm:pl-6 lg:pl-12">
          <span className="text-left align-baseline">Gender : </span>
          {/* <input className="border p-2 shrink focus:outline-0 sm:mt-0 mt-1 sm:ml-3 pl-1  rounded sm:w-3/4 w-full" type="text" placeholder="Enter Username..."/> */}
          <select {...register('gender', { required: true })} className="border hover:cursor-pointer  rounded sm:ml-8 p-2 ml-2" defaultValue="" >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
          </select> 
          {errors.gender && <small className='text-red-600 block mt-2'>This field is required</small>}
       </label>

       <label className="text-left sm:pl-6 lg:px-12">
          <span className="text-left ">Bio : </span>
          <textarea {...register('user_Bio', { required: true })} className="border hover:cursor-pointer  p-2 shrink focus:outline-0 h-22  mt-2 pl-2 rounded  w-full" placeholder="User's Interested Info.."/>
          {errors.user_Bio && <small className='text-red-600 block mt-2'>This field is required</small>}
       </label>

       <button type="submit" className="border bg-gray-600 font-medium text-white mx-auto mt-3 w-fit px-8 py-2 rounded active:bg-gray-400">Set up</button>   
      </form>
      
    </div>
  )
}

export default Profile_Setup_pg
