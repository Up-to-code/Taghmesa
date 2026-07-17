import { AccountSignOut } from "./account-actions";
import { AccountFoodArt } from "./account-food-art";
import { AccountTabs } from "./account-tabs";

export function AccountShell({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const firstName = user.name.split(" ")[0] || "ضيفنا";
  return <div className="account-page">
    <header className="account-hero">
      <AccountFoodArt/>
      <div className="account-hero-inner">
        <div className="account-hero-copy"><span>مساحتك في تغميسة</span><h1>أهلاً، {firstName}</h1><p>طلباتك وبياناتك، مرتّبة في مكان واحد.</p></div>
        <div className="account-hero-user"><span>{user.name}</span><small dir="ltr">{user.email}</small><AccountSignOut/></div>
      </div>
    </header>
    <div className="account-shell"><AccountTabs/><div className="account-route-content">{children}</div></div>
  </div>;
}
