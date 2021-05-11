import React, { useContext, useEffect, useState } from "react";
import CreateChannelModal from "../ModalCreateChannel/CreateChannelModal";
import ChannelSearch from "../ChannelSearch/ChannelSearch";
import NavHead from "../../../../../../components/NavComponents/NavHead";
import { IoMdAdd } from "react-icons/io";
import { RiGroupLine } from 'react-icons/ri';
import axios from "axios";
import { API_URL } from "../../../../../../config";
import { UserContext } from "../../../../../../context/UserContext";
import { SocketContext } from "../../../../../../context/SocketContext";
import "./scrollbar.css";
import Popup from "../../../../../../components/Utils/Notifications/NotificationItem";
import { FiCheckCircle } from 'react-icons/fi';

const ChannelHome = ({ loading, channels, setChannels }) => {
  const [isOpenChannelModal, setIsOpenChannelModal] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [isOpenJoinedChannel, setIsOpenJoinedChannel] = useState(false);
  const [isOpenCreateChannel , setIsOpenCreateChannel] = useState(false);
  const socket = useContext(SocketContext);

  const channelLoadingSkelett = () => {
    const skelettList = [];
    for (let i = 0; i < 7; i++) {
      skelettList.push(
        <div
          key={i}
          className="flex items-center mb-4 cursor-pointer w-full p-2 rounded-lg animate-pulse"
        >
          <div className="w-8 h-8 rounded-md bg-gray-400 mr-3"></div>
          <div className="w-44 h-8 rounded-md bg-gray-400"></div>
        </div>
      );
    }
    return skelettList;
  };

  const handleEnterInChannel = (channel) => {
    setUser({ ...user, currentChannel: channel });
    const resetNotifObject = {
      userID: user.id,
      channelID: channel._id,
    };
    axios
      .post(`${API_URL}channel/resetnotification`, resetNotifObject)
      .then((res) => {
        setChannels((oldChannels) => {
          const channelNotifReset = res.data;
          const indexChannelNotif = oldChannels.findIndex(
            (channel) => channel._id === channelNotifReset._id
          );
          oldChannels[indexChannelNotif] = channelNotifReset;
          return [...oldChannels];
        });
      })
      .catch((err) => {
        console.log("ERROR : " + err);
      });
  };

  return (
    <>

      <button onClick={() => setUser(oldUser => {
        oldUser.notifications.push({
          icons : <FiCheckCircle />,
          color : 'green-500',
          label : 'Salut ceci est un test'
        })
        return {...oldUser}
      })}>ADD NOTIF</button>
      
      {/* <button onClick={() => setUser(oldUser => ({
        user : [{icons : <FiCheckCircle />,
                color : 'green-500',
                label : 'Salut ceci est un test'}
              ,...oldUser.notifications]
      }))}>ADD NOTIF</button> */}

      {/* CREATE CHANNEL MODAL */}
      <CreateChannelModal
        setIsOpenCreateChannel={setIsOpenCreateChannel}    
        isOpen={isOpenChannelModal}
        setIsOpen={setIsOpenChannelModal}
        channels={channels}
        addChannel={setChannels}
      />
      {/* ---------- */}
      
      <NavHead title="Channel" className="justify-between">
        <button
          onClick={() => setIsOpenChannelModal(true)}
          className="channelIcon p-1 rounded-md ctmFocus hoverMenuProfileBg"
        >
          <IoMdAdd className="text-white" />
        </button>
      </NavHead>

      <ChannelSearch
        setIsOpenJoinedChannel={setIsOpenJoinedChannel}
        channels={channels}
        setChannels={setChannels}
      />

      <div className="p-4 overflow-y-scroll scrollbar h-full">
        {loading
          ? channelLoadingSkelett()
          : channels.map((channel, index) => {
              return (
                <button
                  key={channel._id}
                  onClick={() => handleEnterInChannel(channel)}
                  className={`flex items-center ${
                    index !== channels.length - 1 && "mb-4"
                  } relative cursor-pointer w-full ctmFocus hoverMenuProfileBg p-2 rounded-lg`}
                >
                  {channel.notifications.map((notif, index) => {
                    return (
                      notif.notification !== 0 &&
                      notif.userID === user.id && (
                        <div
                          key={index}
                          className="absolute h-6 w-6 bg-red-800 rounded-full flex items-center justify-center -left-1 -top-1 shadow-xl"
                        >
                          <div className="absolute z-0 animate-ping h-4/5 w-4/5 bg-red-800 rounded-full"></div>
                          <span className="text-white z-10 text-sha text-xs">
                            {notif.notification > 99
                              ? "99+"
                              : notif.notification}
                          </span>
                        </div>
                      )
                    );
                  })}
                  <div className="w-8 h-8 channelIcon mr-3 rounded-md flex items-center justify-center text-white uppercase">
                    {channel.name[0]}
                  </div>
                  <span className="text-gray-300 uppercase">
                    {channel.name}
                  </span>
                </button>
              );
            })}
      </div>
    </>
  );
};

export default ChannelHome;
