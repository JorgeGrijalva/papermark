import useSWR from "swr";

import { fetcher } from "@/lib/utils";
import { User } from "@prisma/client";

export function useUserAdmin() {

  const { data: user, error } = useSWR<{isAdmin: boolean}>(
    `/api/user/userAdmin`,
    fetcher,
    {
      dedupingInterval: 20000,
    },
  );

  return {
    user,
    loading: user ? false : true,
    error,
  };
}
