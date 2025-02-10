import { useRouter } from "next/router";

import React from "react";

import AppLayout from "@/components/layouts/app";
import { SettingsHeader } from "@/components/settings/settings-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllContacts } from "@/lib/swr/use-contact";
import { useUserAdmin } from "@/lib/swr/use-user";

export default function ContactUs() {
  const router = useRouter();
  const { contacts, loading, error } = useGetAllContacts();
  const { user } = useUserAdmin();

  React.useEffect(() => {
    if (user && !user.isAdmin) {
      router.push("/settings/general");
    }
  }, [user, router]);

  if (!user?.isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  return (
    <AppLayout>
      <main className="relative mx-2 mb-10 mt-4 space-y-8 overflow-hidden px-1 sm:mx-3 md:mx-5 md:mt-5 lg:mx-7 lg:mt-8 xl:mx-10">
        <SettingsHeader />

        <div>
          <div className="mb-4 flex items-center justify-between md:mb-8 lg:mb-12">
            <div className="w-full space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                Contact Us list{" "}
                <span className="text-orange-500">(admin only)</span>
              </h3>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">
                  List of all contacts who have contacted us.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts?.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.message}</TableCell>
                      <TableCell>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
