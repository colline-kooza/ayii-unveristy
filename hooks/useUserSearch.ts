import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return { users: [] };
      }
      const res = await apiClient.get(
        `/users/search?q=${encodeURIComponent(query)}`,
      );
      return res.data;
    },
    enabled: query.length >= 2,
  });
}
