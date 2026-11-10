import type { CSSProperties } from "react";

/** 12e Downloader brand mark. Kept as a component API to avoid changing layout call sites. */
export function LogoMark({ size = 22 }: { size?: number; glass?: "white" | "indigo" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="logo-mark">
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#17172b" stroke="#7775ff" strokeWidth="2" />
      <path d="M13 20h10v24H13z" fill="#aaa8ff" />
      <path d="M28 20h10v24H28z" fill="#fff" />
      <path d="M43 20h8v8h-8zM43 33h8v11h-8z" fill="#aaa8ff" />
    </svg>
  );
}

/** Mark on the dark rounded brand tile. */
export function BrandTile({ size = 28 }: { size?: number }) {
  return (
    <span className="brand-tile" style={{ width: size, height: size, borderRadius: size * 0.29 } as CSSProperties}>
      <LogoMark size={Math.round(size * 0.78)} />
    </span>
  );
}
