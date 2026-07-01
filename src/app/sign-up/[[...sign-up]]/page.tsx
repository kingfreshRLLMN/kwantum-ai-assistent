import { SignUp } from "@clerk/nextjs";
import BrandMark from "@/components/BrandMark";

export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <BrandMark variant="auth" />
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-orange-600">
            Invite key later
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-950">
            Account aanmaken
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            De invite-key koppeling wordt later aan deze registratie toegevoegd.
          </p>
        </div>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </div>
    </main>
  );
}
