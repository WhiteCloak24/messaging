import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";

const Home = () => {
  const [instance, setInstance] = useState(null);
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      port: 4000,
      transports: ["websocket"],
      auth: {
        token: "aopsidjsoaijdosj",
      },
      parser: customParser,
    });
    setInstance(socket);
    // socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  function sendEvent() {
    instance.emit("heeey", {
      data: "ashdasii",
    });
  }
  return (
    <div>
      <button onClick={sendEvent}>Send Event</button>
    </div>
  );
};

export default Home;
