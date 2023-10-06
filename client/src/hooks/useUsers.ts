import { getUsers } from "@/lib/client";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useQuery } from "react-query";

export function useUsers() {
  const setUsers = useChatRoomStore(state => state.setUsers);
  return useQuery({
    queryKey: QUERIES_KEYS.users,
    queryFn: getUsers,
    onSuccess(data) {
      setUsers(data);
    },
  });
}