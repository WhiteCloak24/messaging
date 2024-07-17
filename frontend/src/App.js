import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { AuthorizationProvider } from "./hooks/useAuthorization";
import { SocketProvider } from "./hooks/useApplicationSocket";
import React, { useEffect } from "react";
import AlertContainer from "./components/AlertContainer";
import TooltipHandler from "./components/Tooltip";
import ImagePreviewer from "./components/ImagePreviewer";
import ModalContainer from "./components/Modal/ModalContainer";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/sw.js`)
        .then((sw) => {
          console.log("Service Worker registered",sw);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthorizationProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthorizationProvider>
      </QueryClientProvider>
      <AlertContainer />
      <TooltipHandler />
      <ImagePreviewer />
      <ModalContainer />
    </>
  );
}

export default App;
