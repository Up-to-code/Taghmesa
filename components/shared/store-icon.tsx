type StoreIconName = "menu" | "cart" | "search" | "close" | "moon" | "pause" | "play" | "flame" | "plus" | "minus" | "check" | "leaf" | "sun" | "heart" | "users" | "award" | "home" | "shop" | "phone" | "user" | "pin" | "mail" | "clock" | "send" | "lock" | "arrow-left";

const paths: Record<StoreIconName, React.ReactNode> = {
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  cart: <><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  moon: <><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></>,
  pause: <><path d="M9 6v12M15 6v12"/></>,
  play: <><path d="m9 6 9 6-9 6Z"/></>,
  flame: <><path d="M12.5 3.5c.6 3-1.6 4.1-1.6 6.1 0 1.1.8 1.9 1.8 1.9 1.5 0 2.4-1.4 2-3.2 2 1.7 3.3 4.1 3.3 6.5a6 6 0 0 1-12 0c0-2.8 1.6-5.4 4.2-7.4-.1 2 .6 3.1 1.5 3.1 1.5 0 2.5-2.8.8-7Z"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  minus: <><path d="M5 12h14"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/></>,
  sun: <><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></>,
  heart: <><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
  award: <><circle cx="12" cy="8" r="6"/><path d="m8.5 13-1.5 9 5-3 5 3-1.5-9"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  shop: <><path d="M4 10v10h16V10M3 4h18l-1.5 6a3 3 0 0 1-5 1 3 3 0 0 1-5 0 3 3 0 0 1-5-1Z"/><path d="M9 20v-5h6v5"/></>,
  phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
  "arrow-left": <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
};

export function StoreIcon({ name, size = 20 }: { name: StoreIconName; size?: number }) {
  return <svg className="store-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
