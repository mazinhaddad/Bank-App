import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

const logoPath = path.join(process.cwd(), "public", "nbb-logo.png");
const hasLogo = fs.existsSync(logoPath);

export function SiteHeader() {
  return (
    <header className="bg-nbb-red">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        {hasLogo ? (
          <Image
            src="/nbb-logo.png"
            alt="NBB"
            width={806}
            height={361}
            className="h-10 w-auto"
            priority
          />
        ) : (
          <span className="text-xl font-extrabold tracking-tight text-white">
            NBB
          </span>
        )}
        <div className="h-8 w-px bg-white/30" />
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-white">
            Bank Ideas
          </span>
          <span className="text-xs text-white/80">
            Submit and browse ideas for improving the bank
          </span>
        </div>
      </div>
    </header>
  );
}
