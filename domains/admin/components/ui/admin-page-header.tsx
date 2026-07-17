import type { ReactNode } from "react";

export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><span className="mb-2 block text-[11px] font-black tracking-wide text-cyan-700">{eyebrow}</span><h1 className="m-0 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{description}</p></div>{action}</header>;
}
