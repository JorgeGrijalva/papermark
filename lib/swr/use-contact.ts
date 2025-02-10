import { useTeam } from "@/context/team-context";
import useSWR from "swr";

import { Contact, TeamDetail } from "@/lib/types";
import { fetcher } from "@/lib/utils";

export function useGetContact() {
  const teamInfo = useTeam();

  const { data: contact, error } = useSWR<TeamDetail>(
    teamInfo?.currentTeam && `/api/teams/${teamInfo.currentTeam.id}/billing/contact`,
    fetcher,
    {
      dedupingInterval: 20000,
    },
  );

  return {
    contact,
    loading: contact ? false : true,
    error,
  };
}

export function useGetAllContacts() {

  const { data: contacts, error } = useSWR<{ contacts: Contact[] }>(
    `/api/teams/contacts/getContact`,
    fetcher,
    {
      dedupingInterval: 20000,
    },
  );

  return {
    contacts: contacts?.contacts,
    loading: contacts ? false : true,
    error,
  };
}
