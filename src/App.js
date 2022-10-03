import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:8000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
return(
  <Chat/>
)
}

export default App;