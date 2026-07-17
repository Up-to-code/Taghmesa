type FlavorSceneName = "story" | "footer" | "contact" | "policy";
type FlavorIconName = "leaf" | "sparkle" | "handmade" | "share" | "quality" | "location" | "phone" | "mail" | "clock";

const iconPaths: Record<FlavorIconName, React.ReactNode> = {
  leaf: <><path d="M7 34C17 24 25 14 38 7c1 14-6 25-20 27"/><path d="M15 28c-1-8 3-13 10-15M26 19c0 5 2 8 6 10"/></>,
  sparkle: <><path d="M24 5c1 9 5 14 14 15-9 1-13 6-14 15-1-9-5-14-14-15 9-1 13-6 14-15Z"/><path d="M38 33c.4 4 2.4 6 6 6.5-3.6.5-5.6 2.5-6 6.5-.5-4-2.5-6-6-6.5 3.5-.5 5.5-2.5 6-6.5Z"/></>,
  handmade: <><path d="M12 25V14c0-3 4-3 4 0v7-11c0-3 4-3 4 0v11-13c0-3 4-3 4 0v13-10c0-3 4-3 4 0v13l4-5c3-3 7 0 5 4l-8 13c-2 4-6 6-11 5-8-1-12-7-12-16Z"/></>,
  share: <><circle cx="13" cy="24" r="5"/><circle cx="36" cy="13" r="5"/><circle cx="36" cy="35" r="5"/><path d="m17 21 14-6M17 27l14 6"/></>,
  quality: <><path d="m24 5 5 5 7-1 2 7 6 4-4 6 1 7-7 2-4 6-6-4-6 4-4-6-7-2 1-7-4-6 6-4 2-7 7 1 5-5Z"/><path d="m16 24 5 5 11-12"/></>,
  location: <><path d="M24 43s13-12 13-24a13 13 0 1 0-26 0c0 12 13 24 13 24Z"/><circle cx="24" cy="19" r="4"/></>,
  phone: <><path d="M15 7h7l3 9-5 3c3 6 7 10 13 13l3-5 8 3v7c0 4-3 7-7 7C20 42 6 28 6 11c0-3 3-4 9-4Z"/></>,
  mail: <><rect x="5" y="9" width="38" height="30" rx="6"/><path d="m8 14 16 13 16-13"/></>,
  clock: <><circle cx="24" cy="24" r="18"/><path d="M24 14v11l8 5"/></>,
};

export function FlavorIcon({ name }: { name: FlavorIconName }) {
  return <svg className="flavor-icon" viewBox="0 0 48 48" aria-hidden="true">{iconPaths[name]}</svg>;
}

export function FlavorScene({ scene }: { scene: FlavorSceneName }) {
  return <div className={`flavor-scene flavor-scene-${scene}`} aria-hidden="true">
    <svg className="flavor-scene-citrus" viewBox="0 0 80 80"><circle cx="40" cy="40" r="28"/><path d="M40 12v56M12 40h56M20 20l40 40M60 20 20 60"/><circle cx="40" cy="40" r="4"/></svg>
    <svg className="flavor-scene-leaf" viewBox="0 0 92 70"><path d="M7 62C27 47 47 29 67 7"/><path d="M23 49C10 48 6 39 9 29c12-1 20 5 20 16M44 33c-1-13 6-21 18-23 3 12-2 21-13 26M64 15c4-8 11-11 19-8-2 8-7 13-16 13"/></svg>
    <svg className="flavor-scene-drop" viewBox="0 0 64 72"><path d="M35 5c-2 12-8 20-17 29-8 8-9 17-4 25 6 10 20 11 29 3 9-8 8-21 1-30-5-7-8-15-9-27Z"/><path d="M23 55c5 4 11 4 16-1"/></svg>
    <svg className="flavor-scene-trail" viewBox="0 0 600 100" preserveAspectRatio="none"><path d="M8 70c86-56 157 25 244-16 72-34 124 18 185-2 50-16 84-40 155-28"/><circle cx="9" cy="70" r="4"/><circle cx="592" cy="24" r="4"/></svg>
  </div>;
}
