path = '/sessions/peaceful-affectionate-brown/mnt/outputs/taghmesa_store_v2.html'
with open(path, encoding='utf-8') as f:
    content = f.read()

def rep(old, new, label):
    global content
    n = content.count(old)
    if n != 1:
        raise SystemExit(f"FAIL[{label}]: found {n} occurrences (expected 1)")
    content = content.replace(old, new, 1)

old_block = '''function makeCard(p){
  const si=selSz[p.id]||0,sv=p.sizes[si];
  const imgH=p.img
    ?`<div class="card-img-wrap" onclick="openLb(${p.id})"><img class="card-img" src="${p.img}" alt="${p.nameAr}" loading="lazy"><div class="zoom-chip"><svg viewBox="0 0 24 24" width="12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6m-3-3h6"/></svg> تكبير</div></div>`
    :`<div class="card-placeholder" style="background:linear-gradient(135deg,rgba(0,149,167,.07),rgba(0,149,167,.16))">${p.emoji}</div>`;
  const szH=p.sizes.map((s,i)=>`<button class="sz-btn ${i===si?'on':''}" onclick="selSz_fn(${p.id},${i})"><span class="sz-top">${s.l}</span><span class="sz-price">${s.p} ر.س</span></button>`).join('');
  return `<div class="card" id="card-${p.id}">
    ${imgH}
    <div class="card-body">
      <div class="card-tags"><span class="cat-tag">${p.cat}</span>${p.isNew?'<span class="new-tag">✨ جديد</span>':''}</div>
      <div><div class="card-name">${p.nameAr}</div><div class="card-en">${p.nameEn}</div></div>
      <p class="card-desc">${p.desc}</p>
      <div class="sizes-lbl">اختر الحجم</div>
      <div class="sizes" id="szs-${p.id}">${szH}</div>
      <div class="card-cal"><svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> <span id="cal-${p.id}">${sv.c}</span></div>
      <div class="card-foot"><div><span class="price-big" id="pr-${p.id}">${sv.p}</span><span class="price-sar">ر.س</span></div>
      <button class="add-btn" id="ab-${p.id}" onclick="addCart(${p.id})"><svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> أضف للسلة</button></div>
    </div>
  </div>`;
}

function selSz_fn(pid,idx){
  selSz[pid]=idx;
  const p=PRODUCTS.find(x=>x.id===pid),sv=p.sizes[idx];
  const prEl=document.getElementById('pr-'+pid);if(prEl)prEl.textContent=sv.p;
  const cEl=document.getElementById('cal-'+pid);if(cEl)cEl.textContent=sv.c;
  const szEl=document.getElementById('szs-'+pid);
  if(szEl)szEl.querySelectorAll('.sz-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
}'''

new_block = '''function makeCard(p){
  const si=selSz[p.id]||0,sv=p.sizes[si];
  const imgH=p.img
    ?`<div class="card-img-wrap" onclick="openLb(${p.id})"><img class="card-img" src="${p.img}" alt="${p.nameAr}" loading="lazy"><div class="zoom-chip"><svg viewBox="0 0 24 24" width="12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6m-3-3h6"/></svg> تكبير</div></div>`
    :`<div class="card-placeholder" style="background:linear-gradient(135deg,rgba(0,149,167,.07),rgba(0,149,167,.16))">${p.emoji}</div>`;
  const szH=p.sizes.map((s,i)=>`<button class="sz-btn ${i===si?'on':''}" onclick="selSz_fn(${p.id},${i},this)" type="button"><span class="sz-top">${s.l}</span><span class="sz-price">${s.p} ر.س</span></button>`).join('');
  return `<div class="card" data-pid="${p.id}">
    ${imgH}
    <div class="card-body">
      <div class="card-tags"><span class="cat-tag">${p.cat}</span>${p.isNew?'<span class="new-tag">✨ جديد</span>':''}</div>
      <div><div class="card-name">${p.nameAr}</div><div class="card-en">${p.nameEn}</div></div>
      <p class="card-desc">${p.desc}</p>
      <div class="sizes-lbl">اختر الحجم</div>
      <div class="sizes">${szH}</div>
      <div class="card-cal"><svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> <span class="cal-txt">${sv.c}</span></div>
      <div class="card-foot"><div><span class="price-big price-txt">${sv.p}</span><span class="price-sar">ر.س</span></div>
      <button class="add-btn" onclick="addCart(${p.id},this)" type="button"><svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> أضف للسلة</button></div>
    </div>
  </div>`;
}

function selSz_fn(pid,idx,btn){
  selSz[pid]=idx;
  const card=btn?btn.closest('.card'):document.querySelector(`.card[data-pid="${pid}"]`);
  if(!card)return;
  const p=PRODUCTS.find(x=>x.id===pid),sv=p.sizes[idx];
  const prEl=card.querySelector('.price-txt');if(prEl)prEl.textContent=sv.p;
  const cEl=card.querySelector('.cal-txt');if(cEl)cEl.textContent=sv.c;
  card.querySelectorAll('.sz-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
}'''

rep(old_block, new_block, "makeCard+selSz_fn")

old_addcart = '''function addCart(pid){
  const p=PRODUCTS.find(x=>x.id===pid),si=selSz[pid]||0,sv=p.sizes[si],key=`${pid}-${si}`;
  const ex=cart.find(i=>i.key===key);
  if(ex){ex.qty++;}else{cart.push({key,pid,nameAr:p.nameAr,emoji:p.emoji,varLbl:sv.l,price:sv.p,qty:1});}
  const btn=document.getElementById('ab-'+pid);
  if(btn){btn.classList.add('added');btn.innerHTML='<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg> أُضيف';setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> أضف للسلة';},1100);}
  updateCart();showToast(`تمت الإضافة: ${p.nameAr} – ${sv.l}`);
}'''

new_addcart = '''function addCart(pid,btn){
  const p=PRODUCTS.find(x=>x.id===pid),si=selSz[pid]||0,sv=p.sizes[si],key=`${pid}-${si}`;
  const ex=cart.find(i=>i.key===key);
  if(ex){ex.qty++;}else{cart.push({key,pid,nameAr:p.nameAr,emoji:p.emoji,varLbl:sv.l,price:sv.p,qty:1});}
  if(btn){btn.classList.add('added');btn.innerHTML='<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg> أُضيف';setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='<svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> أضف للسلة';},1100);}
  const badge=document.getElementById('cartBadge');if(badge){badge.classList.remove('bump');requestAnimationFrame(()=>badge.classList.add('bump'));}
  updateCart();showToast(`تمت الإضافة: ${p.nameAr} – ${sv.l}`);
}'''

rep(old_addcart, new_addcart, "addCart")

# no-results color theme-fix
rep(
'''document.getElementById('shopGrid').innerHTML=list.length?list.map(makeCard).join(''):`<div style="text-align:center;padding:80px;color:#c0d0d4;grid-column:1/-1">''',
'''document.getElementById('shopGrid').innerHTML=list.length?list.map(makeCard).join(''):`<div style="text-align:center;padding:80px;color:var(--text2);grid-column:1/-1">''',
"no-results-color")

# ---------- theme JS functions, added right before final init calls ----------
rep(
"updateCart();renderFeatured();",
'''function toggleTheme(){
  const html=document.documentElement;
  const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
  html.setAttribute('data-theme',next);
  try{localStorage.setItem('tg_theme',next);}catch(e){}
  const lbl=document.getElementById('themeLabelMob');if(lbl)lbl.textContent=next==='dark'?'الوضع النهاري':'الوضع الليلي';
}
(function(){const lbl=document.getElementById('themeLabelMob');if(lbl)lbl.textContent=document.documentElement.getAttribute('data-theme')==='dark'?'الوضع النهاري':'الوضع الليلي';})();
updateCart();renderFeatured();''',
"theme-js-fns")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("STAGE 3 OK", len(content))
