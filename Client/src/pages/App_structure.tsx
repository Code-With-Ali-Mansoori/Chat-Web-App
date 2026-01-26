import Footer_navigater from '../components/footer_navigater';
import Welcome_msg from '../components/Welcome_msg';
import Mychats from '../components/mychats';
import Side_Bar from '../components/Side_Bar';
import Profile_Section from '../components/Profile_Section';
import Search_sction from '../components/Search_sction';
import Search_result from '../components/Search_result';

const App_structure = () => {
  return (
    <div className="flex relative w-full h-screen p-1">
        {/* Left Menu Bar */}
        <Side_Bar/>

        {/* Main App Body */}
        <div className="w-full h-full px-3">

            {/* Header component */}
            <div className='h-17 relative border-b border-gray-300 md:gap-10 flex justify-between items-center'>
                <Profile_Section/>
                <Search_sction/>
            </div>

            {/* Search Account Body component*/}
            {/* <div className='border hidden border-gray-400 rounded-t h-5/7 chat-scroll overflow-y-scroll mt-5 px-3'>    
            </div> */}

            {/* Main Body Components [ My All Chat Rooms or Welcome Message ] */}
            <div className='border  border-gray-400 overflow-x-hidden  overflow-y-scroll chat-scroll rounded-2xl p-3 md:rounded-3xl mt-5 h-5/7 md:h-5/6'>
                <Welcome_msg/>
                <Mychats/>  
                <Search_result/> 
            </div>
            
            {/* Footer Navigator */}
            <Footer_navigater/>
        </div>
    </div>
  )
}

export default App_structure
