import Auth_page from './pages/auth_page'
import Profile_Setup_pg from "./pages/Profile_Setup_pg";
import User_Profile from "./components/User_Profile";
import Pop from "./components/pop";
import App_structure from "./pages/App_structure";
import Chat_page from "./pages/Chat_page";
import Protected_Route from "./components/Protected_Route";
import { Routes, Route } from 'react-router-dom';
import Welcome_msg from './components/Welcome_msg';
import Mychats from './components/mychats';
import PageNotFound from './pages/Not_found';
import Loader from './components/Loader'
import Search_result from './components/Search_result';
import IncomingAudioCall from './components/Inc_Audio_UI';
import IncomingVideoCall from './components/Inc_Video_UI';
import AudioCallUI from './components/Ac_Audio_Call_UI';
import VideoCallUI from './components/Ac_Video_Call_UI';
import Call_history_pg from './components/Call_history_pg';

const App = () => {
  return (
    <div className='h-screen relative'>

        <Routes>
          <Route path='/user/login' element={<Auth_page/>} />
          <Route path='*' element={<PageNotFound/>} />  

          <Route element={<Protected_Route/>}>
            <Route path='/profile/setup' element={<Profile_Setup_pg/>} />
            <Route path="/profile" element={<User_Profile />} /> 
            <Route path='/profile?username=:username&userId=:userId' element={<User_Profile/>} />
            <Route path='/chat-room' element={<Chat_page/>} />
            <Route path='/chat-room?roomId=:roomId&otherUser-public_Id=:public_Id' element={<Chat_page/>} />
            
            <Route path='/incoming-audio-call' element={<IncomingAudioCall/>} />
            <Route path='/incoming-video-call' element={<IncomingVideoCall/>} />

            <Route path='/active-audio-call' element={<AudioCallUI/>} />          
            <Route path='/active-video-call' element={<VideoCallUI/>} />

            <Route path='/' element={<App_structure/>} >
              <Route index element={<Welcome_msg/>} />
              <Route path='my-chats' element={<Mychats/>} />
              <Route path='call-history' element={<Call_history_pg/>} />
              <Route path={`user/search`} element={<Search_result/>} />
            </Route>
          </Route>
          
      </Routes>

      <Pop/>
      <Loader/>
    </div>
  )
}

export default App;

//  1. Bug - Re-creating Room when we search user, 
//  2. Protected Routing for Entire App ( Remaining.. )
