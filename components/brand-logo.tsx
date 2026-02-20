import Image from "next/image";
import { companyProfile } from "@/lib/content";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  textClassName?: string;
};

export function BrandLogo({ size = "md", withText = true, textClassName }: BrandLogoProps) {
  const dimensions =
    size === "sm"
      ? { width: 28, height: 28 }
      : size === "lg"
        ? { width: 48, height: 48 }
        : { width: 40, height: 40 };

  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/intentness-logo-icon.png"
        alt={`${companyProfile.brandName} logo`}
        width={dimensions.width}
        height={dimensions.height}
        className="rounded-lg object-cover"
        priority
      />
      {withText ? (
        <span className={textClassName ?? "font-display text-lg font-semibold tracking-tight"}>{companyProfile.brandName}</span>
      ) : null}
    </span>
  );
}
