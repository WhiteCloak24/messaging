import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { AuthorizationProvider } from "./hooks/useAuthorization";

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
        <RouterProvider router={router} />;
      </AuthorizationProvider>
    </QueryClientProvider>
  );
}

export default App;
