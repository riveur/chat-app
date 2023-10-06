import { getUser } from "@/lib/client";
import { QUERIES_KEYS } from "@/stores/queries-keys";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

export function useAuth() {
  const { setUser } = useUserStore();
  const router = useRouter();
  return useQuery({
    queryKey: QUERIES_KEYS.auth,
    queryFn: getUser,
    retry: false,
    onSuccess(data) {
      setUser(data);
    },
    onError(err) {
      router.push('/login');
    }
  });
}