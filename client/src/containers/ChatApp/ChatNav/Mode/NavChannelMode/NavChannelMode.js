import React, { useContext, useEffect, useState } from "react";
import ChannelHome from "./ChannelHome/ChannelHome";
import CurrentChannel from "./CurrentChannel/CurrentChannel";
import { UserContext } from "../../../../../context/UserContext";
import { SocketContext } from "../../../../../context/SocketContext";
import { API_URL } from "../../../../../config";
import axios from "axios";
import { FiCheckCircle } from 'react-icons/fi';

const NavChannelMode = (props) => {
  const { user, setUser } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  // CHARGER SEULEMENT AU MONTAGE
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}channel/${user.id}`)
      .then((res) => {
        setChannels(res.data);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    socket.on("channelNotification", (channelNotified) => {
      setChannels((oldChannels) => {
        const indexChannelNotif = oldChannels.findIndex(
          (channel) => channel._id === channelNotified._id
        );
        if (indexChannelNotif === -1) return oldChannels;
        let sameChannel = false;
        setUser((oldsUser) => {
          if (oldsUser.currentChannel._id === channelNotified._id)
            sameChannel = true;
          return oldsUser;
        });
        if (sameChannel) {
          const resetNotifObject = {
            userID: user.id,
            channelID: channelNotified._id,
          };
          axios.post(`${API_URL}channel/resetnotification`, resetNotifObject);
          oldChannels[indexChannelNotif].notifications.notification = 0;
          return [...oldChannels];
        }
        oldChannels[indexChannelNotif] = channelNotified;
        return [...oldChannels];
      });
    });
    socket.on("deleteChannel", (deletedChannel) => {
      setUser((oldUser) => {
        oldUser.notifications.push({
          icons : <FiCheckCircle />,
          color : 'green-500',
          label : 'Channel deleted'
        })
        if (oldUser.currentChannel._id !== deletedChannel._id)
          return { ...oldUser };
        oldUser.currentChannel = {};
        return { ...oldUser };
      });
      setChannels((oldChannels) =>
        oldChannels.filter((channel) => channel._id !== deletedChannel._id)
      );
    });
    socket.on("banMember", ({ bannedMember, channelID }) => {
      let isBannedMember = false;
      setUser((oldUser) => {
        if (oldUser.id === bannedMember._id) isBannedMember = true;
        return { ...oldUser };
      });
      if (isBannedMember)
        setChannels((oldChannels) =>
          oldChannels.filter((channel) => channel._id !== channelID)
        );
    });
    return () => {
      socket.off("channelNotification");
      socket.off("deleteChannel");
      socket.off("banMember");
    };
  }, []);

  return (
    <>
      {Object.entries(user.currentChannel).length !== 0 ? (
        <CurrentChannel 
            channels={channels} 
            setChannels={setChannels}
        />
      ) : (
        <ChannelHome
            loading={loading}
            channels={channels}
            setChannels={setChannels}
        />
      )}
    </>
  );
};

export default NavChannelMode;
