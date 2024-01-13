import Chat from "../Chat/Chat";
import Friends from "../Friends/Friends";
import GroupList from "../GroupList/GroupList";
import Sidebar from "../Sidebar/Sidebar";

const Message = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-[186px] h-screen mx-[32px] py-[35px]">
          <Sidebar active="message" />
        </div>
        <div className="w-[427px] mx-[43px] py-[35px] ">
          <GroupList />
          <Friends className="h-[350px]" />
        </div>
        <div className="w-[1100px] p-[20px] ">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Message;
