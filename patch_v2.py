import re

path_in = '/sessions/peaceful-affectionate-brown/mnt/outputs/taghmesa_store_final.html'
path_out = '/sessions/peaceful-affectionate-brown/mnt/outputs/taghmesa_store_v2.html'

with open(path_in, encoding='utf-8') as f:
    content = f.read()

def rep(old, new, label):
    global content
    n = content.count(old)
    if n != 1:
        raise SystemExit(f"FAIL[{label}]: found {n} occurrences (expected 1)")
    content = content.replace(old, new, 1)

# ---------- 1. :root + dark theme variables ----------
rep(
""":root{
  --teal:#0095A7;--deep:#006E7A;--fresh:#00A8B8;
  --aqua:#EAFBFA;--char:#263033;--cream:#EFE1C7;
  --sage:#AFC8A5;--clay:#C88666;--white:#fff;
  --gray:#f3f6f7;--border:#dde8ea;--text2:#6a7d82;
}""",
""":root{
  --teal:#0095A7;--deep:#006E7A;--fresh:#00A8B8;
  --aqua:#EAFBFA;--char:#263033;--cream:#EFE1C7;
  --sage:#AFC8A5;--clay:#C88666;--white:#fff;
  --gray:#f3f6f7;--border:#dde8ea;--text2:#6a7d82;
  --ink:#263033;--surface:#fff;
}
[data-theme="dark"]{
  --teal:#12b3c4;--deep:#0d8f9c;--fresh:#22cbdb;
  --aqua:#0e1a1d;--char:#eaf3f4;--cream:#3a3226;
  --sage:#7fae72;--clay:#d99a76;
  --gray:#182428;--border:#3f5761;--text2:#93acb1;
  --surface:#152227;
}""",
"root-vars")

# ---------- 2. body: add transition ----------
rep(
"body{font-family:'Tajawal',sans-serif;background:var(--aqua);color:var(--char);min-height:100vh;-webkit-font-smoothing:antialiased}",
"body{font-family:'Tajawal',sans-serif;background:var(--aqua);color:var(--char);min-height:100vh;-webkit-font-smoothing:antialiased;transition:background-color .3s ease,color .3s ease}",
"body-transition")

# ---------- 3. surface-ify card/panel backgrounds (var(--white) -> var(--surface)) ----------
surface_targets = [
  '.navbar{background:var(--white);box-shadow:0 1px 18px rgba(0,149,167,.1);position:sticky;top:0;z-index:300}',
  ".nav-search:focus-within{border-color:var(--teal);background:var(--white)}",
  '.mob-nav{display:none;position:fixed;inset:0;z-index:400;background:var(--white);padding:20px 24px;flex-direction:column;gap:6px}',
  '.feat{background:var(--white);border-radius:20px;padding:28px 20px;text-align:center;box-shadow:0 2px 14px rgba(0,149,167,.06);transition:.22s}',
  '.card{background:var(--white);border-radius:22px;overflow:hidden;box-shadow:0 2px 14px rgba(0,149,167,.07);display:flex;flex-direction:column;transition:.24s}',
  '.sbox{background:var(--white);border-radius:18px;padding:20px;box-shadow:0 2px 12px rgba(0,149,167,.05)}',
  ".p-in:focus{border-color:var(--teal);background:var(--white)}",
  ".sort-s{background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:9px 14px;font-family:'Tajawal',sans-serif;font-size:13px;color:var(--char);cursor:pointer;outline:none;direction:rtl;transition:.2s}",
  '.val-c{background:var(--white);border-radius:18px;padding:26px 18px;text-align:center;box-shadow:0 2px 12px rgba(0,149,167,.06);transition:.2s}',
  '.ccard{background:var(--white);border-radius:18px;padding:20px;display:flex;align-items:flex-start;gap:14px;box-shadow:0 2px 10px rgba(0,149,167,.05)}',
  '.cform{background:var(--white);border-radius:22px;padding:32px 28px;box-shadow:0 4px 24px rgba(0,149,167,.08)}',
  ".finput:focus,.ftarea:focus,.fselect:focus{border-color:var(--teal);background:var(--white)}",
  '.co-box{background:var(--white);border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(0,149,167,.07)}',
  '.pol-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px;background:var(--white);border-radius:18px;padding:14px;box-shadow:0 2px 12px rgba(0,149,167,.06)}',
  '.pol-card{background:var(--white);border-radius:18px;padding:26px;margin-bottom:14px;box-shadow:0 2px 10px rgba(0,149,167,.05)}',
  '.cart-draw{width:390px;background:var(--white);height:100%;display:flex;flex-direction:column;box-shadow:-10px 0 44px rgba(0,0,0,.14);direction:rtl;animation:sIn .28s ease}',
]
for t in surface_targets:
    new_t = t.replace('background:var(--white)', 'background:var(--surface)', 1)
    rep(t, new_t, f"surface:{t[:40]}")

# ---------- 4. footer + toast use fixed --ink instead of theme-able --char ----------
rep(".footer{background:var(--char);padding:52px 24px 28px}",
    ".footer{background:var(--ink);padding:52px 24px 28px}",
    "footer-ink")
rep(".toast{position:fixed;bottom:24px;right:24px;background:var(--char);color:var(--white);border-radius:16px;padding:14px 20px;font-size:14px;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 10px 28px rgba(0,0,0,.28);z-index:1000;transform:translateY(90px);opacity:0;transition:.34s cubic-bezier(.34,1.56,.64,1)}",
    ".toast{position:fixed;bottom:24px;right:24px;background:var(--ink);color:#fff;border-radius:16px;padding:14px 20px;font-size:14px;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 10px 28px rgba(0,0,0,.28);z-index:1000;transform:translateY(90px);opacity:0;transition:.34s cubic-bezier(.34,1.56,.64,1)}",
    "toast-ink")

# ---------- 5. theme toggle button styles + interactivity CSS (append before closing </style>) ----------
extra_css = """
.theme-btn{background:var(--gray);border:none;border-radius:12px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--char);transition:.2s;flex-shrink:0}
.theme-btn:hover{background:var(--aqua);color:var(--teal)}
.theme-ico-moon{display:none}
[data-theme="dark"] .theme-ico-sun{display:none}
[data-theme="dark"] .theme-ico-moon{display:inline-flex}
@keyframes pageIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.page.active{animation:pageIn .35s ease}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}
.cart-badge.bump{animation:bump .35s ease}
.sz-btn{transition:.16s,transform .12s}
.sz-btn:active{transform:scale(.95)}
.add-btn:active,.btn-w:active,.btn-o:active,.apply-btn:active,.fsub:active,.place-btn:active,.co-btn:active,.nav-cart:active{transform:scale(.96)}
.flt:active,.pol-tab:active,.cat-card:active{transform:scale(.98)}
.card-img-wrap img{transition:.4s}
"""
rep("</style>", extra_css + "</style>", "extra-css")

with open(path_out, 'w', encoding='utf-8') as f:
    f.write(content)

print("STAGE 1 OK, wrote", path_out, len(content))
