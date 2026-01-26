import Auth_page from './pages/auth_page'
import Profile_Setup_pg from "./pages/Profile_Setup_pg";
import User_Profile from "./components/User_Profile";
// import Pop from "./components/pop";
import App_structure from "./pages/App_structure";
import Chat_page from "./pages/Chat_page";
import { Routes, Route } from 'react-router-dom';
import Welcome_msg from './components/Welcome_msg';
import Mychats from './components/mychats';
import PageNotFound from './pages/Not_found';

const App = () => {
  return (
    <div className='h-screen '>

        <Routes>
          <Route path='/user/login' element={<Auth_page/>} />
          <Route path='/profile/setup' element={<Profile_Setup_pg/>} />
          <Route path='/user/profile' element={<User_Profile/>} />
          <Route path='/chat/room' element={<Chat_page/>} />
          <Route path='*' element={<PageNotFound/>} />

            <Route path='/' element={<App_structure/>} >
                <Route path='welcome-page' element={<Welcome_msg/>} />
                <Route path='my-chats' element={<Mychats/>} />
            </Route>

        </Routes>

      {/* <Pop/> */}
      {/* <App_structure/> */}
      
    </div>
  )
}

export default App;
