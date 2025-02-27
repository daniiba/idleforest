
import IdleForestPopup from "~components/ForestGrid"
import { AuthProvider } from "~context/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "../style.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    }
  }
});

function IndexPopup() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IdleForestPopup />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default IndexPopup
