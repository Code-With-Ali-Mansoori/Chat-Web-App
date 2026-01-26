import Auth_page from './pages/auth_page'
import Profile_Setup_pg from "./pages/Profile_Setup_pg";
import User_Profile from "./components/User_Profile";
import Pop from "./components/pop";
import App_structure from "./pages/App_structure";
import Chat_page from "./pages/Chat_page";

const App = () => {
  return (
    <div className='h-screen '>
      <Auth_page/>
      <Profile_Setup_pg/>
      <Pop/>
      <App_structure/>
      <User_Profile/>
      <Chat_page/>
    </div>
  )
}

export default App;