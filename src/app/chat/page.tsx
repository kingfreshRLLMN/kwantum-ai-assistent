import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ChatInterface from "@/components/ChatInterface";
import { getCurrentAppUser } from "@/lib/roles";

export default async function ChatPage() {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <AppHeader role={user.role} />
      <ChatInterface />
    </>
  );
}
