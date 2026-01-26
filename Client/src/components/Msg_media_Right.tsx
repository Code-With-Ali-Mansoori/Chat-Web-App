const Msg_media_Right = () => {
  return (
    <div className="w-full flex justify-end  h-fit py-2">
        <div className="flex justify-center gap-3 ">

            <div className="border bg-gray-100 border-gray-300 md:ml-14 ml-8 w-fit rounded-2xl">
                <a href="https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg?cs=srgb&fm=jpg" target="_blank" rel="noopener noreferrer"
                className="block md:w-80 md:h-40 w-48 h-28 cursor-pointer">
                    <img src="https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg?cs=srgb&fm=jpg" alt="Shared media" className="h-full w-full rounded-t-2xl object-cover"/>
                </a>
                <small className=" p-2 flex justify-end w-full items-center text-right">08:33 pm</small>
            </div>


            <div className="md:h-8 mt-1 md:w-8 h-8 w-8">
                    <img className="w-full border border-gray-100 rounded-full place-self-start h-full" src="https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png" alt="user_profile_img" />
            </div>

        </div>
    </div>
  )
}

export default Msg_media_Right
