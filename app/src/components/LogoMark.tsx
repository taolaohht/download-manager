import { useId } from "react";

/** A compact 12e mark: a clean download arrow inside a softly rounded outline. */
export function LogoMark({ size = 22, glass = "white" }: { size?: number; glass?: "white" | "indigo" }) {
  const id = useId().replace(/:/g, "");
  const white = glass === "white";
  const stroke = white ? "#ffffff" : "#6257d9";
  const fill = white ? "#ffffff" : "#6257d9";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="logo-mark">
      <defs>
        <linearGradient id={`${id}g`} x1="12" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor={white ? "#fff" : "#a69aff"} stopOpacity={white ? ".2" : ".22"} />
          <stop offset="1" stopColor={white ? "#fff" : "#6257d9"} stopOpacity={white ? ".08" : ".12"} />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="54" height="54" rx="17" fill={`url(#${id}g)`} stroke={stroke} strokeOpacity={white ? ".75" : ".85"} strokeWidth="2.5" />
      <path d="M32 15v23m0 0 10-10M32 38 22 28" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 45v3a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3v-3" stroke={fill} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Mark on the dark rounded brand tile (reads the same in both themes). */
export function BrandTile({ size = 28 }: { size?: number }) {
  return (
    <span className="brand-tile" style={{ width: size, height: size, borderRadius: size * 0.29 }}>
      <LogoMark size={Math.round(size * 0.78)} />
    </span>
  );
}
