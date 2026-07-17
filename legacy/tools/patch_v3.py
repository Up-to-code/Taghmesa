path = '/sessions/peaceful-affectionate-brown/mnt/outputs/taghmesa_store_v2.html'
with open(path, encoding='utf-8') as f:
    content = f.read()

def rep(old, new, label):
    global content
    n = content.count(old)
    if n != 1:
        raise SystemExit(f"FAIL[{label}]: found {n} occurrences (expected 1)")
    content = content.replace(old, new, 1)

# ---------- A. Early theme-set script in <head> (avoid flash) ----------
rep(
'<meta name="viewport" content="width=device-width, initial-scale=1.0">',
'''<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>try{var __t=localStorage.getItem('tg_theme');if(!__t){__t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}document.documentElement.setAttribute('data-theme',__t);}catch(e){}</script>''',
"head-theme-script")

# ---------- B. Theme toggle button in desktop navbar (before nav-cart) ----------
rep(
'''    <button class="nav-cart" onclick="openCart()">''',
'''    <button class="theme-btn" onclick="toggleTheme()" aria-label="تبديل الوضع الليلي/النهاري" type="button">
      <span class="ico theme-ico-sun" style="width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></span>
      <span class="ico theme-ico-moon" style="width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
    </button>
    <button class="nav-cart" onclick="openCart()">''',
"theme-btn-desktop")

# ---------- C. Theme toggle row in mobile nav (before mob-link cart) ----------
rep(
'''  <button class="mob-link" onclick="openCart();closeMob()">''',
'''  <button class="mob-link" onclick="toggleTheme()" type="button">
    <span class="ico theme-ico-sun" style="width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></span>
    <span class="ico theme-ico-moon" style="width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
    <span id="themeLabelMob">الوضع الليلي</span>
  </button>
  <button class="mob-link" onclick="openCart();closeMob()">''',
"theme-btn-mobile")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("STAGE 2 OK", len(content))
