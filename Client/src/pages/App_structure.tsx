import Footer_navigater from '../components/footer_navigater';
import Side_Bar from '../components/Side_Bar';
import Profile_Section from '../components/Profile_Section';
import Search_sction from '../components/Search_sction';
// import Search_result from '../components/Search_result';
import { Outlet } from 'react-router-dom';

const App_structure = () => {

  return (
    <div className="flex relative w-full h-dvh p-1">
        {/* Left Menu Bar */}
        <Side_Bar/>

        {/* Main App Body */}
        <div className="w-full h-full px-3 flex flex-col">

            {/* Header component */}
            <div className='h-17 shrink-0 relative border-b border-gray-300 flex justify-between items-center'>
                <Profile_Section/>
                <Search_sction/>
            </div>

            {/* Main Body Components [ My All Chat Rooms or Welcome Message ] */}
            <div className='border border-gray-400 overflow-x-hidden overflow-y-scroll chat-scroll rounded-2xl p-3 md:rounded-3xl mt-5 flex-grow mb-20 md:mb-5'>
                {/* <Search_result/>  */}
                <Outlet />
            </div>
            
            {/* Footer Navigator */}
            <div className='md:hidden'>
                <Footer_navigater/>
            </div>
        </div>
    </div>
  )
}

export default App_structure
