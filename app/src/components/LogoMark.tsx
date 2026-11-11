import type { CSSProperties } from "react";

/** 12e Downloader brand mark. Kept as a component API to avoid changing layout call sites. */
export function LogoMark({ size = 22 }: { size?: number; glass?: "white" | "indigo" }) {
  return (
    <img
      src="/brand/icon.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className="logo-mark"
      draggable={false}
    />
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
