export type PolicyIconName = "delivery" | "returns" | "privacy" | "terms";

const iconPaths: Record<PolicyIconName, React.ReactNode> = {
  delivery: <>
    <path d="M7 17h22v17H7z"/><path d="M29 22h7l6 7v5H29z"/>
    <path d="M12 17V11h13v6M35 23v6h6"/><circle cx="15" cy="35" r="4"/><circle cx="35" cy="35" r="4"/>
  </>,
  returns: <>
    <path d="M14 15h24v24H14z"/><path d="M14 22h24M20 15l4-6h7l4 6"/>
    <path d="M30 29h-8l3-3M22 29l3 3"/>
  </>,
  privacy: <>
    <path d="M24 6 39 12v10c0 10-6 17-15 21C15 39 9 32 9 22V12l15-6Z"/>
    <rect x="18" y="21" width="12" height="10" rx="2"/><path d="M21 21v-3a3 3 0 0 1 6 0v3"/>
  </>,
  terms: <>
    <path d="M12 6h19l7 7v29H12z"/><path d="M31 6v8h7M18 22h14M18 29h14M18 36h8"/>
    <path d="m6 31 4 4"/>
  </>,
};

export function PolicyIcon({ name }: { name: PolicyIconName }) {
  return <svg className="policy-icon" viewBox="0 0 48 48" aria-hidden="true">{iconPaths[name]}</svg>;
}

export function PolicyHeroArt() {
  return <svg className="policy-hero-art" viewBox="0 0 560 430" role="img" aria-label="رسم توضيحي لملف سياسات تغميسة">
    <defs>
      <linearGradient id="policy-paper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffdf8"/><stop offset="1" stopColor="#e9f5f3"/></linearGradient>
      <linearGradient id="policy-seal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d99a75"/><stop offset="1" stopColor="#b96f4e"/></linearGradient>
      <filter id="policy-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="15" floodColor="#062f34" floodOpacity=".24"/></filter>
    </defs>
    <path className="policy-art-orbit" d="M45 226C86 63 239 15 397 62c109 33 145 143 89 235-55 91-194 120-303 82C77 342 17 309 45 226Z"/>
    <circle className="policy-art-dot" cx="72" cy="106" r="7"/><circle className="policy-art-dot" cx="484" cy="329" r="5"/>
    <g filter="url(#policy-shadow)" transform="rotate(-6 276 220)">
      <rect x="137" y="45" width="286" height="345" rx="28" fill="url(#policy-paper)"/>
      <path d="M179 112h116M179 140h202M179 168h170" className="policy-art-line"/>
      <g className="policy-art-check"><circle cx="372" cy="111" r="17"/><path d="m364 111 6 6 11-13"/></g>
      <path d="M179 217h202M179 245h164M179 273h190" className="policy-art-line policy-art-line-soft"/>
      <rect x="179" y="310" width="99" height="38" rx="19" className="policy-art-pill"/>
      <path d="M198 329h60" className="policy-art-pill-line"/>
      <g transform="translate(343 326)"><circle r="47" fill="url(#policy-seal)"/><path d="m-17 0 11 11L20-17" className="policy-art-seal-check"/><path d="M-27-29c15-12 38-9 50 6M27 28c-15 12-38 9-50-6" className="policy-art-seal-detail"/></g>
    </g>
    <g className="policy-art-leaf"><path d="M91 337c34-32 64-62 89-105"/><path d="M119 305c-33 3-45-16-39-43 29-2 45 13 42 39M145 269c-2-29 15-47 44-49 5 28-9 47-40 52"/></g>
    <g className="policy-art-spark"><path d="M454 91c2 15 9 23 24 25-15 2-22 10-24 25-2-15-9-23-24-25 15-2 22-10 24-25Z"/><path d="M492 144c1 7 4 11 11 12-7 1-10 5-11 12-1-7-4-11-11-12 7-1 10-5 11-12Z"/></g>
  </svg>;
}
