import BrandMark from "@/components/BrandMark";
import InviteCodeSignup from "@/components/InviteCodeSignup";
import SprinkleBackground from "@/components/SprinkleBackground";

export default function SignUpPage() {
  return (
    <main className="kwantum-auth-page relative flex min-h-dvh items-center justify-center overflow-hidden bg-zinc-50 px-4 py-8">
      <SprinkleBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <div className="motion-soft mb-6 flex w-full flex-col items-center text-center">
          <BrandMark variant="auth" />
          <h1 className="mt-5 max-w-sm text-center text-3xl font-bold leading-tight text-zinc-950">
            Meld je aan met je code.
          </h1>
        </div>
        <InviteCodeSignup />
      </div>
    </main>
  );
}
