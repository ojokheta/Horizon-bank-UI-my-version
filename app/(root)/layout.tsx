import AppShell from "@/components/AppShell";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();
  if(!loggedIn) redirect('/sign-in')

  return (
    <AppShell user={loggedIn}>
      {children}
    </AppShell>
  );
}
