import { Compass, X } from "lucide-react"

const Pop = () => {
  return (
    <div className="flex hidden fixed z-10 md:left-10 top-0 h-full w-full justify-center items-center">
      {/* Just on /off flex-hidden here */}
    <div className=" bg-gray-100 rounded-2xl px-3 py-4  md:h36 h-fit w-58 md:w80 ">

      <span className="mb-3 flex justify-between border-b border-gray-200 pb-1">
        <span className="flex justify-center items-center gap-1">
          <p className="pl-2 font-medium">Quick actions</p>
          <Compass className="pt-1" strokeWidth={1.8} size={20}/>
        </span>

        <X className="bg-gray-200  hover:cursor-pointer p-1 rounded-full" strokeWidth={1.75} size={22}/>
      </span>

        <small className="ml-2 font-medium block"> Which option you have to choose</small>
        <small className="ml-2 font-medium block my-1"> for Ali_Mansoori123?</small>
        {/* <small className="font-medium pl-2"></small> */}
        <div className="flex justify-center items-center gap-1 md:gap-4 pt-3 ">
            <small className=" rounded border  hover:cursor-pointer border-black px-2 py-1 font-medium bg- text-">View Profile</small>
            <small className="border border-black rounded px-2 py-1 ml-3 md:ml-0  font-medium text-white hover:cursor-pointer bg-black">Let's Chat</small>
        </div>
    </div>
    </div>
  )
}

export default Pop
