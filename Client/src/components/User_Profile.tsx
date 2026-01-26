import Footer_navigater from "./footer_navigater"
import Profile_pg from "./Profile_pg"
import Side_Bar from "./Side_Bar"

const User_Profile = () => {
  return (
    <div className="flex relative w-full h-screen p-1">
        
        {/* Left Big Screen Menu Bar  */}
        <Side_Bar/>

        {/* Main User-Profile Page */}
        <div className="h-5/6 md:h-6/6 mt-  md:m-1 md:mt-0 w-full">
            <Profile_pg/>
        </div>
        
        {/* Bottom Navigation Bar for Mobile Screen */}
        <Footer_navigater/>
    </div>
  )
}

export default User_Profile
