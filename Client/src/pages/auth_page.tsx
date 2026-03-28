const Auth_page = () => {
  return (
    <div className="flex bg-gray-100 flex-col gap-5 items-center justify-center h-full">

        <a href="http://localhost:5000/oauth/auth/google" className="h-14 pl-1 rounded-2xl bg-white border w-54 lg-w-58 mx-8 border-gray-300 flex items-center justify-between hover:cursor-pointer hover:bg-gray-200">
            <img className="h-12  rounded-2xl" src="https://i.pinimg.com/736x/c5/8e/9b/c58e9b5909c8b4403cfd7d9ab2bce9aa.jpg" alt="" />
            <p className="pr-7 pl-1">Start with Google</p>
        </a> 

          <a href="http://localhost:5000/oauth/auth/facebook" className="h-14 pl-1 rounded-2xl bg-white border w-54 lg-w-58 mx-8 border-gray-300 flex items-center justify-between hover:cursor-pointer hover:bg-gray-200">
            <img className="h-12 rounded-2xl" src="https://i.pinimg.com/1200x/80/45/a1/8045a163ba890a7d17b830ccf4028ec6.jpg" alt="" />
            <p className="pr-3 pl-1">Start with Facebook</p>
        </a> 

    </div>
  )
}

export default Auth_page;