import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import SprinkleBackground from "@/components/SprinkleBackground";

export default function SignInPage() {
  return (
    <main className="kwantum-auth-page relative flex min-h-dvh items-center justify-center overflow-hidden bg-zinc-50 px-4 py-8">
      <SprinkleBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <div className="motion-soft mb-6 flex w-full flex-col items-center text-center">
          <BrandMark variant="auth" />
          <h1 className="mt-5 max-w-sm text-center text-3xl font-bold leading-tight text-zinc-950">
            Log hier in voor je vragen.
          </h1>
        </div>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              cardBox: "mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-lg",
              card: "w-full px-6 py-7",
              header: "hidden",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "h-12 rounded-xl bg-zinc-900 text-base font-bold hover:bg-orange-600",
              formFieldInput:
                "h-12 rounded-xl border-zinc-200 text-base focus:border-orange-500 focus:ring-orange-500",
              formFieldLabel: "text-sm font-medium text-zinc-800",
              footer: "hidden",
              footerAction: "hidden",
              footerPages: "hidden",
              footerPageLink: "hidden",
            },
          }}
        />
        <Link
          href="/sign-up"
          className="interactive-lift motion-soft motion-soft-delay-2 mt-4 block w-full rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 text-center text-sm font-bold text-orange-700 shadow-sm backdrop-blur hover:bg-orange-50"
        >
          Aanmelden met code
        </Link>
      </div>
    </main>
  );
}
