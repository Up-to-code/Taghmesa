path = '/sessions/peaceful-affectionate-brown/mnt/outputs/taghmesa_store_v4.html'
with open(path, encoding='utf-8') as f:
    content = f.read()

def rep(old, new, label):
    global content
    n = content.count(old)
    if n != 1:
        raise SystemExit(f"FAIL[{label}]: found {n} (expected 1)")
    content = content.replace(old, new, 1)

# find the PRODUCTS array declaration start/end to drop the hardcoded data entirely
start_marker = "const PRODUCTS=[\n"
end_marker = "\nconst IMG_P=PRODUCTS.filter(p=>p.img);\nconst selSz={};PRODUCTS.forEach(p=>selSz[p.id]=0);\nconst cart=[];\nlet curPage='home',curCat='الكل',searchQ='',minP=0,maxP=9999,sortMode='default';"

s_idx = content.index(start_marker)
e_idx = content.index(end_marker) + len(end_marker)
old_full = content[s_idx:e_idx]

new_full = """let PRODUCTS=[];
let IMG_P=[];
const selSz={};
const cart=[];
let curPage='home',curCat='الكل',searchQ='',minP=0,maxP=9999,sortMode='default';

async function loadProducts(){
  try{
    const res=await fetch('api/products.php',{headers:{'Accept':'application/json'}});
    if(!res.ok)throw new Error('bad status '+res.status);
    PRODUCTS=await res.json();
  }catch(e){
    console.error('فشل تحميل المنتجات من الخادم:',e);
    PRODUCTS=[];
    showToast('تعذّر تحميل المنتجات، تحقق من الاتصال بالخادم');
  }
  PRODUCTS.forEach(p=>{if(!(p.id in selSz))selSz[p.id]=0;});
  IMG_P=PRODUCTS.filter(p=>p.img);
  renderFeatured();
  if(curPage==='shop')renderShop();
}"""

assert old_full == start_marker.rstrip('\n') and False or True  # placeholder no-op
content = content[:s_idx] + new_full + content[e_idx:]
print("PRODUCTS block replaced, removed", len(old_full), "chars, inserted", len(new_full))

# ---- renderCheckout: keep as-is (already theme/image aware) ----

# ---- selPay: read data-pm instead of relying on text match, keep card-fields toggle ----
rep(
"""function selPay(el){
  document.querySelectorAll('.pay-opt').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  document.getElementById('cardFields').style.display=el.textContent.includes('بطاقة')?'block':'none';
}""",
"""function selPay(el){
  document.querySelectorAll('.pay-opt').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  document.getElementById('cardFields').style.display=el.dataset.pm==='card'?'block':'none';
}""",
"selPay")

# ---- placeOrder: real submission to api/orders.php ----
rep(
"""function placeOrder(){
  const num='TG-'+Math.floor(10000+Math.random()*90000);
  document.getElementById('orderNum').textContent='رقم الطلب: #'+num;
  document.getElementById('coForm').classList.add('hidden');
  document.getElementById('orderOk').classList.remove('hidden');
  cart.length=0;updateCart();showToast('تم تأكيد طلبك بنجاح! 🎉');
}""",
"""async function placeOrder(){
  if(!cart.length){showToast('السلة فارغة!');return;}
  const firstName=document.getElementById('coFirstName').value.trim();
  const lastName=document.getElementById('coLastName').value.trim();
  const phone=document.getElementById('coPhone').value.trim();
  const city=document.getElementById('coCity').value.trim();
  const address=document.getElementById('coAddress').value.trim();
  const notes=document.getElementById('coNotes').value.trim();
  const payEl=document.querySelector('.pay-opt.on');
  const paymentMethod=payEl?payEl.dataset.pm:'cod';

  if(!firstName||!lastName||!phone||!city||!address){
    showToast('يرجى تعبئة جميع بيانات التوصيل المطلوبة');
    return;
  }

  const btn=document.querySelector('.place-btn');
  const origHtml=btn?btn.innerHTML:null;
  if(btn){btn.disabled=true;btn.innerHTML='جاري إرسال الطلب...';}

  try{
    const res=await fetch('api/orders.php',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        firstName,lastName,phone,city,address,notes,paymentMethod,
        items:cart.map(it=>({pid:it.pid,varLbl:it.varLbl,qty:it.qty})),
      }),
    });
    const data=await res.json();
    if(!res.ok){
      showToast(data.error||'تعذّر إرسال الطلب، حاول مرة أخرى');
      if(btn){btn.disabled=false;btn.innerHTML=origHtml;}
      return;
    }
    document.getElementById('orderNum').textContent='رقم الطلب: #'+data.orderNumber;
    document.getElementById('coForm').classList.add('hidden');
    document.getElementById('orderOk').classList.remove('hidden');
    cart.length=0;updateCart();showToast('تم تأكيد طلبك بنجاح! 🎉');
  }catch(e){
    console.error(e);
    showToast('تعذّر الاتصال بالخادم، تحقق من الإنترنت وحاول مرة أخرى');
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML=origHtml;}
  }
}""",
"placeOrder")

# ---- init: fetch products instead of relying on hardcoded data ----
rep(
"updateCart();renderFeatured();",
"updateCart();loadProducts();",
"init-load")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("DONE", len(content))
