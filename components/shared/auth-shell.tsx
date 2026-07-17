import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { StoreIcon } from "./store-icon";

export function BrandLetterArt({ className = "" }: { className?: string }) {
  return <svg className={`brand-letter-art ${className}`} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g className="brand-letter-forms">
      <text x="65" y="185">ت</text><text x="945" y="165">غ</text>
      <text x="185" y="690">م</text><text x="910" y="700">س</text>
      <text x="560" y="390">ة</text>
    </g>
    <g className="brand-letter-lines">
      <circle cx="108" cy="568" r="58"/><path d="M108 510v116M50 568h116M67 527l82 82M149 527l-82 82"/>
      <path d="M1030 505c-36 34-70 76-96 131M966 588c-50 0-72-30-61-68 43 0 69 21 69 61M1003 550c-4-47 22-75 66-82 10 43-8 73-48 92"/>
      <path d="M300 148c116-62 220 41 340-18 103-50 186 22 277-8" strokeDasharray="8 15"/>
    </g>
  </svg>;
}

export function AuthShell({ children }: { children: ReactNode }) {
  return <main className="auth-page">
    <BrandLetterArt/>
    <Link className="auth-home" href="/" aria-label="العودة إلى تغميسة">
      <Image src="/taghmesa-logo.png" alt="" width={48} height={48}/>
      <span><strong>تغميسة</strong><small>نكهات أصيلة</small></span>
    </Link>
    <div className="auth-layout">
      <aside className="auth-story" aria-label="عن تغميسة">
        <span className="auth-story-kicker">من مطبخنا إلى سفرتك</span>
        <h2>نكهات تجمعنا،<br/><em>وحكايات تبقى.</em></h2>
        <p>سجّل دخولك لتصل إلى طلباتك وتكمل رحلتك مع نكهاتنا البيتية الأصيلة.</p>
        <div className="auth-story-points">
          <span><StoreIcon name="leaf"/> مكونات مختارة</span>
          <span><StoreIcon name="heart"/> محضّرة بحب</span>
          <span><StoreIcon name="check"/> تجربة سهلة وآمنة</span>
        </div>
        <svg className="auth-story-drawing" viewBox="0 0 360 190" aria-hidden="true"><path d="M22 144c72-54 133 25 205-15 50-28 78 7 112-19"/><circle cx="22" cy="144" r="4"/><circle cx="339" cy="110" r="4"/><path d="M265 42c-10 22-26 37-46 51 30 4 50-8 60-35 7 24 23 37 48 41-18-22-37-41-62-57Z"/></svg>
      </aside>
      <section className="auth-card">{children}</section>
    </div>
    <small className="auth-legal">© 2026 تغميسة · خصوصيتك محفوظة</small>
  </main>;
}
