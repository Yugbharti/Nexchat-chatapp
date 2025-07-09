import { onAuthStateChanged } from "firebase/auth";
import "../App.css";
import Chat from "./Chat";
import ChatList from "./ChatList";
import Details from "./Details";
import Login from "./Login/Login";
import Notification from "./notifications/Notification";
import { auth } from "../lib/firebase";
import useUserStore from "../lib/UserStore";
import { useState, useEffect } from "react";
import useChatStore from "../lib/chatStore";

export default function Container() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const [authChecked, setAuthChecked] = useState(false);
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        fetchUserInfo(null);
      }
      setAuthChecked(true);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);
  if (!authChecked || isLoading)
    return <div className="loading">Loading...</div>;
  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="row">
      {currentUser && currentUser.uid ? (
        <>
          <ChatList />
          {chatId && <Chat />}
          {chatId && <Details />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}
