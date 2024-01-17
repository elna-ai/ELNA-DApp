
import { QueryClient, QueryCache } from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

export default queryClient;
