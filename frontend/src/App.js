import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { AuthorizationProvider } from "./hooks/useAuthorization";
import { SocketProvider } from "./hooks/useApplicationSocket";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthorizationProvider>
        <SocketProvider>
          <RouterProvider router={router} />;
        </SocketProvider>
      </AuthorizationProvider>
    </QueryClientProvider>
  );
}

export default App;
