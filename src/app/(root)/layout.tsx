import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={session.user} />

      <div className="container py-10">{children}</div>
    </main>
  );
};
export default HomeLayout;
