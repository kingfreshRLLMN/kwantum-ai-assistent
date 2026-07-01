import Image from "next/image";

type BrandMarkProps = {
  variant?: "header" | "auth" | "compact";
};

export default function BrandMark({ variant = "header" }: BrandMarkProps) {
  if (variant === "compact") {
    return (
      <Image
        src="/brand/kwantum_logo.jpg"
        alt="Kwantum"
        width={40}
        height={40}
        className="h-10 w-10 rounded-2xl object-cover"
        priority
      />
    );
  }

  if (variant === "auth") {
    return (
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/brand/kwantum_logo.jpg"
        alt="Kwantum"
        width={72}
        height={72}
        className="h-[72px] w-[72px] rounded-3xl object-cover shadow-sm"
          priority
        />
        <Image
          src="/brand/payoff.png"
          alt="Kwantum - Hoe leuk is dat?"
          width={600}
          height={50}
          className="h-auto w-full max-w-xs"
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/brand/kwantum_logo.jpg"
        alt="Kwantum"
        width={40}
        height={40}
        className="h-10 w-10 rounded-2xl object-cover"
        priority
      />
      <Image
        src="/brand/logo_kwantum.png"
        alt="Kwantum"
        width={260}
        height={120}
        className="h-7 w-auto"
        priority
      />
    </div>
  );
}
