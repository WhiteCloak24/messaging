import { io } from "socket.io-client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      port: 4000,
      transports: ["websocket"],
      auth: {
        token: "aopsidjsoaijdosj",
      },
    });
    // socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
