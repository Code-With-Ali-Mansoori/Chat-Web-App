const MySearchResults = () => {
  return (
    <div className="w-full  h-full py">
        
        <div className="w-full my-3 h-13 flex justify-between items-center border rounded border-gray-500 p-2 "> 
            <div className=" md: md:pl-">
                <div className="h-10 w-10 bg-[url('https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')] bg-cover bg-center cursor-pointer"></div>
            </div>

            <div className="flex w-4/6 p-1 px-3 flex-col justify-center items-start">
                <p >Ali_Mansoori123</p>
                <small className="font-light">today 12:20 am</small>
            </div>

            <div className="md: flex justify-end w-2/6">
                <small className="items-end px-1 text-green-600">online</small>
            </div>
        </div>

        <div className="w-full my-3 h-13 flex justify-between items-center border rounded border-gray-500 p-2 "> 
            <div className=" md: md:pl-">
                <div className="h-10 w-10 bg-[url('https://static.vecteezy.com/system/resources/previews/019/896/008/non_2x/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png')] bg-cover bg-center cursor-pointer"></div>
            </div>

            <div className="flex w-4/6 p-1 px-3 flex-col justify-center items-start">
                <p >Ali_Mansoori123</p>
                <small className="font-light">today 12:20 am</small>
            </div>

            <div className="md: flex justify-end w-2/6">
                <small className="items-end px-1 text-green-600">online</small>
            </div>
        </div>

    </div>   
  )
}

export default MySearchResults;