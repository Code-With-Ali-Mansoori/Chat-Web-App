import { ChevronLeft, Images, Phone, SendHorizontal, SmilePlus, Video} from "lucide-react"
import Picker, { type EmojiClickData }  from "emoji-picker-react";  // For emoji select
import Text_Ui from "./Text_Ui"
import { useNavigate, useSearchParams } from "react-router-dom"
import { capitalizeFirstLetter } from "../helper/LetterFirst"
import { getFileTypeCategory, validateFile } from "../helper/validateFile"
import useOtherUser from "../Hooks/useOtherUser"
import { useSocket } from "../Hooks/Sockets"
import { useEffect, useState, type ChangeEvent } from "react"
import useProfile_Hooks from "../Hooks/Profile.Hook";
import axios from "axios";
import Image_msgs from "./Image_msg";
import Video_msgs from "./Video_msgs";
import File_msg from "./File_msg";

type Media_Data = {
  File_url : string,
  File_type : 'image' | 'video' | 'file' | 'unknown'
};

type Text_Data = {
  msg: string;
};

export type NewMessage = {
  msg_Id : string;
  sender_id: string;
  msg_type: 'text' | 'file';
  room_id?: string;
  is_msgSeen? : boolean;
  Media_data? : Media_Data;
  Text_data? : Text_Data
};

// then Chat-UI hit one more get/api [ /chat-room/users/publicId=:id ] for userdata
const Chat_UI = () => {
    
  const [typingTimeout, setTypingTimeout] = useState<null | number>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false); 
  const [isEmoji_Click, SetIsEmoji_Click] = useState<boolean>(false);
  const [userMessgae, setUserMessgae] = useState<string>('');

  const [newMessages, setnewMessages] = useState<NewMessage[]>([]);
  // const [newMedia_File, setMedia_File] = useState<Media_Data[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [fileValidationSuccess, setFileValidationSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // const [mediaData, setMediaData] = useState<Media_Data | null>(null);

  const navigator =  useNavigate();
  const socket = useSocket();

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const publicId = searchParams.get("otherUser-public_Id") as string; 

  const { data : Other_UserData } = useOtherUser(publicId);
  const { data : myProfile } = useProfile_Hooks();

  useEffect(() => {
    if (!roomId) return;
    socket.emit('join-room', roomId);

    return () => {
      socket.emit('leave-room', roomId);
    };
  }, [roomId, socket]);

  useEffect(() => {
    const handleUsersTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on('users-typing', handleUsersTyping);
    socket.on('stop-typinggggg', handleStopTyping);

    // Handle incoming message from server via sockets
    socket.on('receive-msg', (msg_Id : string , msg: string, sender_id: string, room_id: string) => {
        
        setnewMessages((prev) => [...prev, 
          { msg_Id : msg_Id,
            sender_id: sender_id,
            msg_type: 'text',
            room_id: room_id,
            is_msgSeen : false,
            Text_data : {
              msg
            }
          }]);

        const myId = myProfile?.message?.data?.user_id;

        if (myId && myId !== sender_id) {
          socket.emit('msg_seen_instantly', { msg_Id, room_id });
        };
      }
    );

    //Listen Media Hnadler
    socket.on('receive-media', (msg_id, sender_Id, media_URL, media_Type, roomId) => {

      // console.log(msg_id, sender_Id, media_URL, media_Type, roomId);

      setnewMessages((prev) => [...prev, 
          { 
            msg_Id : msg_id,
            sender_id: sender_Id,
            msg_type: 'file',
            room_id: roomId,
            is_msgSeen : false,
            Media_data : {
              File_url : media_URL,
              File_type : media_Type
            }
          }]);

        const myId = myProfile?.message?.data?.user_id;

        if (myId && myId !== sender_Id) {
          socket.emit('msg_seen_instantly', { msg_Id: msg_id, room_id: roomId });
        };
      
    });

    //NEW - Handle of Un-seen Messages in Room 
    socket.on('update_seen_many', (msgIds : string[]) => {
      if (!Array.isArray(msgIds)) return;

      setnewMessages((prev) => prev.map((m) => {
        if (m.msg_Id && msgIds.includes(m.msg_Id)) {
          return { ...m, is_msgSeen: true };
        }
        return m;
      }));
    });

    //NEW - UPDATE UI FOR SEEN IN Staying in Room
    socket.on('update_seen', (msg_Id) => {
      setnewMessages((prev) => prev.map((m) => (m.msg_Id === msg_Id ? { ...m, is_msgSeen: true } : m)));
    });

    return () => {
      socket.off('users-typing', handleUsersTyping);
      socket.off('stop-typinggggg', handleStopTyping);
      socket.off('receive-msg');
      socket.off('update_seen');
      socket.off('update_seen_many');
      socket.off('receive-media');
    };
  }, [socket, myProfile, setnewMessages]);

  const handleLeaveChatRoom = () => {
        socket.emit('leave-room', roomId);
        navigator('/my-chats');
    };

    const handleInputMsg = (e : ChangeEvent<HTMLInputElement> , room_id : string) => {
        
        if (typingTimeout) {
          window.clearTimeout(typingTimeout);
        }

        setUserMessgae(e.target.value)

        socket.emit('start-typing', room_id);

        const timeoutId = window.setTimeout(() => {
          socket.emit('stop-typing' , room_id);
        }, 4000);

        setTypingTimeout(timeoutId);
    };

    const onEmojiClick = ( emojiObject : EmojiClickData ) => {
        SetIsEmoji_Click(true);
        setUserMessgae(prev => prev + emojiObject.emoji);
    };

    //Sending Text-Message via Sockets
    const hanlde_UserMessage_Sending = () => {

        if ( userMessgae.length == 0 ) {
            alert('Message Is required!');
            return;
        };

        const senderMsg = {
            msg :  userMessgae,
            msg_type : 'text',
            sender_id : myProfile?.message.data.user_id,  //MyId
            room_id : roomId,
        };

        socket.emit('send-message', senderMsg);
        setUserMessgae('');
    };

    //Validate Media Input
    const handleMediaValidation = (e : React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      
      if (!file) {
        setSelectedFile(null);
        setFileValidationError(null);
        setFileValidationSuccess(null);
        return;
      }

      // Validate file
      const validation = validateFile(file);

      if (!validation.valid) {
        setSelectedFile(null);
        setFileValidationError(validation.error || 'Invalid file');
        setFileValidationSuccess(null);

        // Reset input
        e.target.value = '';
        return;
      }

      // File is valid
      setSelectedFile(file);
      setFileValidationError(null);
      setFileValidationSuccess(`✅ ${file.name} (${(file.size / 1024).toFixed(2)}KB) - Ready to upload`);
    };

    // Clear selected file
    const clearSelectedFile = () => {
      setSelectedFile(null);
      setFileValidationError(null);
      setFileValidationSuccess(null);

      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    };

    //Upload Media to Server via API
    const handleMediaSending = async () => {

      if (!selectedFile || !myProfile?.message.data.user_id || !roomId) {
        console.log("File OR UserId OR RoomId Not found!");
        return;
      };

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile); //Same name as multer in backend
        formData.append("senderId", myProfile?.message.data.user_id);
        formData.append("roomId", roomId);

        const res = await axios.post('http://localhost:5000/room/msgs/media', formData , {withCredentials : true});

        if (res.status != 200) {
          setSelectedFile(null);
          setFileValidationError('Error in File Sharing!');
          setFileValidationSuccess(null);
          return 
        };

        clearSelectedFile();

        const mediaType = getFileTypeCategory(res?.data?.data?.mediaURL);
        // console.log(res.data.data);
        
        socket.emit('send-media', {
          msg_id : res.data.data.msg_id,
          roomId : res.data.data.roomId,
          sender_Id : res.data.data.senderId,
          media_URL : res.data.data.mediaURL,
          media_Type : mediaType
        }); 
      } catch (error) {
        setFileValidationError('Error uploading file!');
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    };

  // (listener moved to useEffect to prevent duplicate registrations)
  return (<div id={roomId as string} className="h-full w-full relative ">
        <div className="border-b border-gray-400 flex justify- items-center gap-1 py-3 px-2">

            <div onClick={() => {handleLeaveChatRoom()}} className="w-fit hover:cursor-pointer"><ChevronLeft strokeWidth={1.5} /></div>

            <div onClick={() => {navigator(`/profile?username=${Other_UserData?.username}&userId=${Other_UserData?.user_publicId}`)}} className="flex items-center  gap-2 w-4/5">
                <div className="h-10 w-10">
                    <img className="w-full rounded-full hover:cursor-pointer h-full" src={Other_UserData?.userAvatar} alt="user_profile_img" />
                </div>
                <div className="flex flex-col">
                    <small className="font-medium md:hidden hover:cursor-pointer">
                        {capitalizeFirstLetter(Other_UserData?.username as string)}
                    </small>

                    <big className="font-medium hidden md:inline hover:cursor-pointer"> 
                        {capitalizeFirstLetter(Other_UserData?.username as string as string)}
                    </big>

                    <small className={`text-left font-medium text-gray-400`}>
                        { Other_UserData?.active_status ? 'Online' : 'Offline'}
                    </small>
                </div>
            </div>
            <div className="flex w-1/5 justify-center items-center gap-4 lg:gap-6 mr-2">     
                    <div className="hover:cursor-pointer"><Phone strokeWidth={1.25} /></div>
                    <div className="hover:cursor-pointer"><Video strokeWidth={1.25} size={28}/></div>
            </div>
        </div>

        <div className="h-4/5 relative z-1 1 p-3 border-b border-gray-400 chat-scroll2 overflow-y-scroll overflow-x-hidden"> 

        {/* All Messgaes */}
        <div>
            { newMessages.length > 0 && newMessages.map((m) => (
                m.msg_type === 'text' && m.Text_data?.msg ?  //Text msg
                  <Text_Ui key={m.msg_Id} recived_msg={m} msg_seen={Boolean(m?.is_msgSeen)} /> 

                :  m.msg_type === 'file' && m.Media_data?.File_type === 'image' ? //Image msg
                  <Image_msgs key={m.msg_Id} recived_msg={m} msg_seen={Boolean(m?.is_msgSeen)}/>

                    : m.msg_type === 'file' && m.Media_data?.File_type === 'video' ? //Video msg
                      <Video_msgs key={m.msg_Id} recived_msg={m} msg_seen={Boolean(m?.is_msgSeen)}/>

                      : m.msg_type === 'file' && m.Media_data?.File_type === 'file' ? //File msg
                        <File_msg key={m.msg_Id} recived_msg={m} msg_seen={Boolean(m?.is_msgSeen)}/>

                        : m.msg_type === 'file' && m.Media_data?.File_type === 'unknown' && //Files msg
                        <File_msg key={m.msg_Id} recived_msg={m} msg_seen={Boolean(m?.is_msgSeen)}/>
            ))}

            {/* Typing Indicator */}
            <div className={`${isTyping ? 'flex' : 'hidden'} 'mt-1 gap-3 justify-start items-center'`}>
                <div className="md:h-8 md:w-8 h-8 w-8 flex justify-center items-center mt-3">
                    <img className="w-full rounded-full hover:cursor-pointer h-full" src={Other_UserData?.userAvatar} alt="user_profile_img" />
                </div>

                <div className=" mt-3 pr-3 pl-2 py-2 rounded-2xl border bg-gray-200 border-gray-300 w-fit">
                    <span className="type-text">Typing...</span>
                </div>
            </div>
        </div>

            {/* Emoji Picker */}
          <div className="fixed bottom-20 left-5 md:left-148 md:bottom-28 z-90 ">
            { isEmoji_Click && (
                <Picker  width={255} height={360} onEmojiClick={onEmojiClick} /> 
            )}
          </div> 
            
            {/* File Validation Messages */}
            { !isUploading && <div className="mt-2 flex-col gap-1 absolute flex justify-center items-center w-full pr-4">
              {/* File Erorr UI*/}
              {fileValidationError && (
                <div className="text-red-500 text-sm px-3 py-2 bg-red-50 rounded border border-red-200">
                  ❌ {fileValidationError}
                </div>
              )}
              
              {/* File Success UI*/}
              {fileValidationSuccess && (
                <div className="text-green-600 text-sm px-3 py-2 bg-green-50 rounded border border-green-200">
                  {fileValidationSuccess}
                </div>
              )}

              
            </div>}

            {/* Uploading Loader */}
            
              {isUploading && ( <div className="w-full flex justify-center items-center">
                <div className=" flex justify-center  text-sm px-3 py-2 text-black rounded w-fit items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 "></div>
                  Uploading...
                </div>
              </div>)}
            
        </div>

        
        <div className=" pt h-fit w-full relative"> 

            <div className="h-12 pt-3 border-gray-400 rounded-2xl gap-2 px-3 flex justify-evenly items-center mx-2">
                
                <div onClick={() => SetIsEmoji_Click(!isEmoji_Click)} className={`"hover:cursor-pointer" ${isEmoji_Click ? "text-gray-700 border-b-2 border-b-gray-600 pb-1" : "text-gray-500"}`}>
                    <SmilePlus strokeWidth={1.25}/>
                </div>  

                <input value={userMessgae} onChange={(e) => handleInputMsg(e, roomId as string)} type="text" className="border mx-2 border-gray-400  focus:outline-none rounded  p-2 pl-2 w-4/5" placeholder="message..."/>

                <div className=" flex justify-center items-center gap-3">
                  {/* Select Media button - Hidden */}
                  {!selectedFile && <div>
                    <form 
                    method="POST" 
                    action="" 
                    encType="multipart/form-data">
                      <input 
                      accept="image/*,video/*,application/pdf,.doc,.docx,.txt" 
                      onChange={(e) => handleMediaValidation(e)} 
                      type="file" 
                      id="fileUpload" 
                      className="hidden" 
                      />
                    </form>
                    <label htmlFor="fileUpload" >
                        <Images className="text-gray-600 hover:cursor-pointer" strokeWidth={1.25}/>
                    </label>
                  </div>}

                  {/* Clear file button if file selected */}
                  {selectedFile && (
                    <div 
                      onClick={clearSelectedFile}
                      className="text-red-500 hover:cursor-pointer"
                      title="Clear selected file"
                    >
                      Cancle
                    </div>
                  )}

                    <div onClick={ () => !selectedFile ? hanlde_UserMessage_Sending() : handleMediaSending() } className={`flex hover:cursor-pointer justify-center items-center gap-2 border px-2 py-1 border-gray-400 rounded md:rounded-2xl ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <button disabled={isUploading}>{ selectedFile ? (isUploading ? 'Uploading...' : 'Upload') : 'Send'} </button>
                        <SendHorizontal className="sm:inline hidden text-gray-500" strokeWidth={1.25} />
                    </div>

                </div>
            </div>
        </div>
        
    </div>)
}

export default Chat_UI;