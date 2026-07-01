import { SignIn } from "@clerk/nextjs";
import BrandMark from "@/components/BrandMark";

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <BrandMark variant="auth" />
          <h1 className="mt-2 text-3xl font-bold text-zinc-950">
            Inloggen bij de AI Assistent
          </h1>
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
