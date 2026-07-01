import AppHeader from "@/components/AppHeader";
import DocumentManager from "@/components/DocumentManager";
import MobileNav from "@/components/MobileNav";
import RoleGate from "@/components/RoleGate";
import { listDocuments } from "@/lib/documents";
import { getCurrentAppUser } from "@/lib/roles";

export default async function DocumentsPage() {
  const user = await getCurrentAppUser();
  const documents = await listDocuments();

  return (
    <RoleGate minimumRole="owner">
      {user ? (
        <>
          <AppHeader role={user.role} title="Documents" />
          <main className="mx-auto min-h-dvh w-full max-w-5xl bg-zinc-50 px-4 pb-28 pt-5 md:pb-8">
            <DocumentManager initialDocuments={documents} uploaderName={user.name} />
          </main>
          <MobileNav role={user.role} />
        </>
      ) : null}
    </RoleGate>
  );
}
