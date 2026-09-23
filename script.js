const $ = s => document.querySelector(s);
const el = (tag, props={}, ...kids) => {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k,v]) => {
    if(k==='class') e.className=v;
    else if(k==='html') e.innerHTML=v;
    else if(k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k,v);
  });
  kids.flat().forEach(k=> e.append(k instanceof Node ? k : document.createTextNode(k)));
  return e;
};

const PROVINCES = {
  "تهران": ["تهران","ری","اسلامشهر","شهریار","نسیم‌شهر","رباط‌کریم","ورامین","پاکدشت","پیشوا","قرچک","دماوند","فیروزکوه","پردیس","قدس","ملارد","اندیشه","باقرشهر","صفادشت"],
  "اصفهان": ["اصفهان","کاشان","نجف‌آباد","خمینی‌شهر","شاهین‌شهر","فولادشهر","مبارکه","نطنز","گلپایگان","خوانسار","نائین","اردستان","شهرضا","سمیرم","داران","فریدون‌شهر","زرین‌شهر","تیران","دهاقان","آران و بیدگل","دولت‌آباد"],
  "خراسان رضوی": ["مشهد","نیشابور","سبزوار","تربت حیدریه","تربت جام","قوچان","کاشمر","گناباد","چناران","فریمان","درگز","سرخس","تایباد","خواف","رشتخوار","بردسکن","فیض‌آباد"],
  "فارس": ["شیراز","مرودشت","کازرون","جهرم","فسا","لار","داراب","آباده","اقلید","نی‌ریز","فیروزآباد","لامرد","استهبان","نورآباد ممسنی","سپیدان","زرقان","کوار","خرامه","مهر"],
  "آذربایجان شرقی": ["تبریز","مراغه","میانه","اهر","مرند","بناب","سراب","شبستر","ملکان","هریس","هشترود","بستان‌آباد","کلیبر","ورزقان","جلفا","اسکو","آذرشهر","خداآفرین"],
  "آذربایجان غربی": ["ارومیه","خوی","بوکان","مهاباد","میاندوآب","سلماس","پیرانشهر","نقده","تکاب","ماکو","شاهین‌دژ","سردشت","اشنویه","چالدران","پلدشت"],
  "خوزستان": ["اهواز","آبادان","دزفول","خرمشهر","بهبهان","ماهشهر","شوشتر","ایذه","اندیمشک","شوش","رامهرمز","باغ‌ملک","هویزه","سوسنگرد","هندیجان","امیدیه","حمیدیه","لالی","مسجدسلیمان","رامشیر","گتوند"],
  "مازندران": ["ساری","بابل","آمل","قائم‌شهر","بابلسر","نوشهر","چالوس","تنکابن","رامسر","نکا","بهشهر","جویبار","نور","فریدونکنار","محمودآباد","پل‌سفید","عباس‌آباد","گلوگاه","میاندورود"],
  "گیلان": ["رشت","بندرانزلی","لاهیجان","آستارا","لنگرود","رودسر","تالش","صومعه‌سرا","فومن","ماسال","رودبار","آستانه‌اشرفیه","شفت","خمام","سیاهکل","املش","رضوانشهر"],
  "کرمان": ["کرمان","سیرجان","رفسنجان","بم","جیرفت","زرند","بردسیر","شهربابک","راور","کهنوج","بافت","ارزوئیه","عنبرآباد","رابر","منوجان","فهرج","قلعه‌گنج"],
  "البرز": ["کرج","نظرآباد","فردیس","هشتگرد","ساوجبلاغ","طالقان","اشتهارد","چهارباغ"],
  "قم": ["قم","جعفریه","دستجرد","سلفچگان","کهک"],
  "همدان": ["همدان","ملایر","نهاوند","تویسرکان","اسدآباد","رزن","کبودراهنگ","بهار","فامنین"],
  "یزد": ["یزد","میبد","اردکان","بافق","ابرکوه","تفت","مهریز","اشکذر","هرات (خاتم)","بهاباد","زارچ"],
  "کرمانشاه": ["کرمانشاه","اسلام‌آباد غرب","سنقر","کنگاور","هرسین","پاوه","جوانرود","قصرشیرین","سرپل ذهاب","گیلانغرب","صحنه","روانسر","ثلاث باباجانی"],
  "هرمزگان": ["بندرعباس","میناب","قشم","کیش","بندرلنگه","رودان","حاجی‌آباد","جاسک","بستک","پارسیان","ابوموسی","خمیر"],
  "سیستان و بلوچستان": ["زاهدان","زابل","چابهار","ایرانشهر","سراوان","خاش","نیک‌شهر","کنارک","سرباز","مهرستان","میرجاوه","هیرمند","زهک","دلگان","قصرقند"],
  "اردبیل": ["اردبیل","مشکین‌شهر","پارس‌آباد","خلخال","گرمی","بیله‌سوار","نمین","نیر","سرعین","کوثر"],
  "بوشهر": ["بوشهر","برازجان","گناوه","دیر","کنگان","خورموج","تنگستان","جم","دیلم","عسلویه"],
  "قزوین": ["قزوین","تاکستان","محمدیه","بوئین‌زهرا","آوج","آبیک"],
  "زنجان": ["زنجان","ابهر","قیدار","خرمدره","ماهنشان","طارم","ایجرود"],
  "گلستان": ["گرگان","گنبدکاووس","علی‌آباد","آق‌قلا","کردکوی","بندرترکمن","مینودشت","کلاله","رامیان","آزادشهر","گالیکش","بندرگز","مراوه‌تپه"],
  "لرستان": ["خرم‌آباد","بروجرد","دورود","الیگودرز","ازنا","کوهدشت","پلدختر","نورآباد (دلفان)","الشتر (سلسله)","چگنی","رومشکان","چغلوندی","زاغه","سپیددشت","معمولان","چالانچولان"],
  "مرکزی": ["اراک","ساوه","خمین","محلات","دلیجان","تفرش","آشتیان","شازند","خنداب","کمیجان"],
  "کردستان": ["سنندج","سقز","مریوان","بانه","قروه","بیجار","کامیاران","دیواندره","دهگلان","سروآباد"],
  "چهارمحال و بختیاری": ["شهرکرد","بروجن","فارسان","لردگان","اردل","کوهرنگ","بن","کیار","سامان"],
  "خراسان شمالی": ["بجنورد","شیروان","اسفراین","فاروج","آشخانه","جاجرم","جوهرآباد"],
  "خراسان جنوبی": ["بیرجند","قاین","فردوس","طبس","نهبندان","سربیشه","اسدیه","بشرویه","زیرکوه","سرایان"],
  "ایلام": ["ایلام","دهلران","آبدانان","دره‌شهر","ایوان","مهران","سرابله","بدره","ملکشاهی","چوار"],
  "کهگیلویه و بویراحمد": ["یاسوج","گچساران","دهدشت","سی‌سخت","باشت","لنده"],
  "سمنان": ["سمنان","شاهرود","دامغان","گرمسار","مهدیشهر","میامی","ایوانکی","سرخه"]
};

const CATEGORIES = ["لبنیات","گوشت و پروتئین","میوه و سبزیجات","نان و غلات","نوشیدنی","آرایشی و بهداشتی","خشکبار و تنقلات","یخی و منجمد","سایر"];

const PERSIAN_MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const toFa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

// Jalali (Shamsi) <-> Gregorian conversion using the browser's built-in Persian calendar (ICU-based, accurate)
const faCal = new Intl.DateTimeFormat('en-US-u-ca-persian', {year:'numeric', month:'numeric', day:'numeric', timeZone:'UTC'});
function persianPartsOf(date){
  const parts = faCal.formatToParts(date);
  return {
    y: Number(parts.find(p=>p.type==='year').value),
    m: Number(parts.find(p=>p.type==='month').value),
    d: Number(parts.find(p=>p.type==='day').value)
  };
}
function gregorianToJalaali(gy,gm,gd){
  const p = persianPartsOf(new Date(Date.UTC(gy, gm-1, gd, 12)));
  return [p.y, p.m, p.d];
}
function jalaaliToGregorian(jy,jm,jd){
  let guess = new Date(Date.UTC(jy+622, jm-1, jd, 12));
  for(let iter=0; iter<4; iter++){
    const p = persianPartsOf(guess);
    const diffDays = (jy-p.y)*365.2425 + (jm-p.m)*30.44 + (jd-p.d);
    guess = new Date(guess.getTime() + Math.round(diffDays)*86400000);
  }
  for(let delta=-15; delta<=15; delta++){
    const cand = new Date(guess.getTime() + delta*86400000);
    const p = persianPartsOf(cand);
    if(p.y===jy && p.m===jm && p.d===jd) return [cand.getUTCFullYear(), cand.getUTCMonth()+1, cand.getUTCDate()];
  }
  return [jy+622, jm, jd];
}
function daysInJalaliMonth(jy,jm){
  const [gy1,gm1,gd1] = jalaaliToGregorian(jy,jm,1);
  let nextJy=jy, nextJm=jm+1; if(nextJm>12){ nextJm=1; nextJy=jy+1; }
  const [gy2,gm2,gd2] = jalaaliToGregorian(nextJy,nextJm,1);
  return Math.round((Date.UTC(gy2,gm2-1,gd2) - Date.UTC(gy1,gm1-1,gd1))/86400000);
}
function isoToJalaliText(iso){
  const [gy,gm,gd] = iso.split('-').map(Number);
  const [jy,jm,jd] = gregorianToJalaali(gy,gm,gd);
  return `${toFa(jd)} ${PERSIAN_MONTHS[jm-1]} ${toFa(jy)}`;
}

const DB = {
  users: () => JSON.parse(localStorage.getItem('bk_users')||'[]'),
  saveUsers: (u) => localStorage.setItem('bk_users', JSON.stringify(u)),
  products: (uid) => JSON.parse(localStorage.getItem('bk_products_'+uid)||'[]'),
  saveProducts: (uid, p) => localStorage.setItem('bk_products_'+uid, JSON.stringify(p)),
  session: () => localStorage.getItem('bk_session'),
  setSession: (uid) => uid ? localStorage.setItem('bk_session', uid) : localStorage.removeItem('bk_session')
};

let state = { mode: 'login' };

function daysUntil(dateStr){
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  return Math.round((d-today)/86400000);
}
function statusOf(days){
  if(days < 0) return 'bad';
  if(days <= 7) return 'warn';
  return 'ok';
}
function statusLabel(days){
  if(days < 0) return `${Math.abs(days)} روز پیش منقضی شده`;
  if(days === 0) return 'امروز منقضی می‌شود';
  if(days <= 7) return `${days} روز مانده`;
  return `${days} روز مانده`;
}

function render(){
  const root = $('#app'); root.innerHTML = '';
  const uid = DB.session();
  root.append(uid ? renderDashboard(uid) : renderAuth());
}

function renderAuth(){
  const card = el('div',{class:'auth-card'});
  const wrap = el('div',{class:'auth-screen'}, card);

  const tabs = el('div',{class:'tabs'},
    el('button',{class: state.mode==='login'?'active':'', onclick:()=>{state.mode='login'; render();}}, 'ورود'),
    el('button',{class: state.mode==='signup'?'active':'', onclick:()=>{state.mode='signup'; render();}}, 'ثبت‌نام فروشگاه')
  );

  card.append(
    el('div',{class:'mark',style:'width:44px;height:44px;border-radius:12px;background:var(--teal);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px;'}, '🥗'),
    el('h2',{}, state.mode==='login' ? 'ورود به بهداشت کالا' : 'ثبت‌نام فروشگاه'),
    el('p',{class:'hint'}, state.mode==='login' ? 'وارد حساب فروشگاه خود شوید' : 'مدیریت موجودی و تاریخ انقضای کالاها'),
    tabs
  );

  const errBox = el('div',{class:'err'});

  if(state.mode==='login'){
    const phone = el('input',{type:'tel', placeholder:'شماره موبایل'});
    const pass = el('input',{type:'password', placeholder:'رمز عبور'});
    const form = el('form',{onsubmit:(e)=>{
      e.preventDefault();
      const users = DB.users();
      const u = users.find(x=>x.phone===phone.value.trim() && x.password===pass.value);
      if(!u){ errBox.textContent = 'شماره موبایل یا رمز عبور اشتباه است.'; return; }
      DB.setSession(u.id); render();
    }},
      el('div',{class:'field'}, el('label',{},'شماره موبایل'), phone),
      el('div',{class:'field'}, el('label',{},'رمز عبور'), pass),
      errBox,
      el('button',{class:'btn', type:'submit'}, 'ورود')
    );
    card.append(form);
  } else {
    const fn = el('input',{placeholder:'مثلاً علی'});
    const ln = el('input',{placeholder:'مثلاً محمدی'});
    const store = el('input',{placeholder:'مثلاً سوپرمارکت سبز'});
    const phone = el('input',{type:'tel', placeholder:'۰۹xxxxxxxxx'});
    const pass = el('input',{type:'password', placeholder:'یک رمز عبور بسازید'});
    const provinceSel = el('select',{}, el('option',{value:''},'استان را انتخاب کنید'));
    Object.keys(PROVINCES).forEach(p=> provinceSel.append(el('option',{value:p}, p)));
    const citySel = el('select',{}, el('option',{value:''},'ابتدا استان را انتخاب کنید'));
    provinceSel.addEventListener('change', ()=>{
      citySel.innerHTML='';
      const cities = PROVINCES[provinceSel.value] || [];
      citySel.append(el('option',{value:''}, cities.length? 'شهر را انتخاب کنید' : 'ابتدا استان را انتخاب کنید'));
      cities.forEach(c=> citySel.append(el('option',{value:c}, c)));
    });
    const address = el('input',{placeholder:'آدرس دقیق فروشگاه'});

    const form = el('form',{onsubmit:(e)=>{
      e.preventDefault();
      if(!fn.value.trim()||!ln.value.trim()||!store.value.trim()||!phone.value.trim()||!pass.value||!provinceSel.value||!citySel.value){
        errBox.textContent = 'لطفاً همه فیلدهای ضروری را پر کنید.'; return;
      }
      const users = DB.users();
      if(users.some(u=>u.phone===phone.value.trim())){
        errBox.textContent = 'این شماره موبایل قبلاً ثبت شده است.'; return;
      }
      const u = {
        id: 'u'+Date.now(), firstName: fn.value.trim(), lastName: ln.value.trim(),
        storeName: store.value.trim(), phone: phone.value.trim(), password: pass.value,
        province: provinceSel.value, city: citySel.value, address: address.value.trim()
      };
      users.push(u); DB.saveUsers(users); DB.setSession(u.id); render();
    }},
      el('div',{class:'row2'},
        el('div',{class:'field'}, el('label',{},'نام'), fn),
        el('div',{class:'field'}, el('label',{},'نام خانوادگی'), ln)
      ),
      el('div',{class:'field'}, el('label',{},'نام فروشگاه'), store),
      el('div',{class:'row2'},
        el('div',{class:'field'}, el('label',{},'استان'), provinceSel),
        el('div',{class:'field'}, el('label',{},'شهر'), citySel)
      ),
      el('div',{class:'field'}, el('label',{},'آدرس فروشگاه'), address),
      el('div',{class:'row2'},
        el('div',{class:'field'}, el('label',{},'شماره موبایل'), phone),
        el('div',{class:'field'}, el('label',{},'رمز عبور'), pass)
      ),
      errBox,
      el('button',{class:'btn', type:'submit'}, 'ساخت حساب فروشگاه')
    );
    card.append(form);
  }
  return wrap;
}

function renderDashboard(uid){
  const users = DB.users();
  const user = users.find(u=>u.id===uid);
  if(!user){ DB.setSession(null); return renderAuth(); }
  let products = DB.products(uid);

  const container = el('div',{});

  // Header
  container.append(
    el('header',{class:'top'},
      el('div',{class:'brand'},
        el('div',{class:'mark'}, '🥗'),
        el('div',{}, el('h1',{},'بهداشت کالا'), el('small',{},'مدیریت موجودی و تاریخ انقضا'))
      ),
      el('button',{class:'btn ghost small', onclick:()=>{DB.setSession(null); render();}}, 'خروج')
    )
  );

  container.append(
    el('div',{class:'storebar'},
      el('div',{},
        el('h2',{}, user.storeName),
        el('div',{class:'loc'}, `📍 ${user.province} — ${user.city}${user.address? ' • '+user.address:''}`),
        el('div',{class:'who'}, `مدیر فروشگاه: ${user.firstName} ${user.lastName}`)
      )
    )
  );

  // Stats
  const total = products.length;
  const totalQty = products.reduce((s,p)=>s+Number(p.quantity||0),0);
  const expired = products.filter(p=>daysUntil(p.expiryDate)<0).length;
  const soon = products.filter(p=>{const d=daysUntil(p.expiryDate); return d>=0 && d<=7;}).length;

  container.append(
    el('div',{class:'stats'},
      el('div',{class:'stat'}, el('b',{}, total), el('span',{},'تعداد اقلام')),
      el('div',{class:'stat'}, el('b',{}, totalQty), el('span',{},'موجودی کل')),
      el('div',{class:'stat warn'}, el('b',{}, soon), el('span',{},'نزدیک به انقضا')),
      el('div',{class:'stat bad'}, el('b',{}, expired), el('span',{},'منقضی شده'))
    )
  );

  // Add product form
  const nameIn = el('input',{placeholder:'مثلاً شیر پرچرب ۱ لیتری'});
  const catIn = el('select',{}); CATEGORIES.forEach(c=> catIn.append(el('option',{value:c},c)));
  const qtyIn = el('input',{type:'number', min:'0', placeholder:'تعداد', value:'1'});
  const addErr = el('div',{class:'err'});

  // Jalali (Shamsi) date picker
  const todayG = new Date();
  const [curJY,curJM,curJD] = gregorianToJalaali(todayG.getFullYear(), todayG.getMonth()+1, todayG.getDate());
  const yearSel = el('select',{class:'jal-year'});
  for(let y=curJY-1; y<=curJY+6; y++) yearSel.append(el('option',{value:y}, toFa(y)));
  yearSel.value = curJY;
  const monthSel = el('select',{class:'jal-month'});
  PERSIAN_MONTHS.forEach((m,i)=> monthSel.append(el('option',{value:i+1}, m)));
  monthSel.value = curJM;
  const daySel = el('select',{class:'jal-day'});
  function rebuildDays(){
    const jy = Number(yearSel.value), jm = Number(monthSel.value);
    const len = daysInJalaliMonth(jy, jm);
    const keep = Math.min(Number(daySel.value)||curJD, len);
    daySel.innerHTML = '';
    for(let d=1; d<=len; d++) daySel.append(el('option',{value:d}, toFa(d)));
    daySel.value = keep;
  }
  yearSel.addEventListener('change', rebuildDays);
  monthSel.addEventListener('change', rebuildDays);
  rebuildDays();
  daySel.value = curJD;

  const addForm = el('form',{onsubmit:(e)=>{
    e.preventDefault();
    if(!nameIn.value.trim()){ addErr.textContent='نام کالا را وارد کنید.'; return; }
    addErr.textContent='';
    const [gy,gm,gd] = jalaaliToGregorian(Number(yearSel.value), Number(monthSel.value), Number(daySel.value));
    const expiryDate = `${gy}-${String(gm).padStart(2,'0')}-${String(gd).padStart(2,'0')}`;
    const list = DB.products(uid);
    list.push({id:'p'+Date.now(), name:nameIn.value.trim(), category:catIn.value, quantity:Number(qtyIn.value||0), expiryDate});
    DB.saveProducts(uid, list);
    nameIn.value=''; qtyIn.value='1'; yearSel.value=curJY; monthSel.value=curJM; rebuildDays(); daySel.value=curJD;
    render();
  }},
    el('div',{class:'grid3'},
      el('div',{class:'field'}, el('label',{},'نام کالا'), nameIn),
      el('div',{class:'field'}, el('label',{},'دسته‌بندی'), catIn),
      el('div',{class:'field'}, el('label',{},'تعداد'), qtyIn),
      el('div',{class:'field'}, el('label',{},'تاریخ انقضا (شمسی)'),
        el('div',{class:'jal-date'}, yearSel, monthSel, daySel)
      )
    ),
    addErr,
    el('button',{class:'btn add-row-btn', type:'submit'}, '+ افزودن کالا')
  );

  container.append(el('div',{class:'panel'}, el('h3',{},'ثبت کالای جدید'), addForm));

  // Filters
  const searchIn = el('input',{placeholder:'جستجوی کالا...', value: state.search||''});
  const catFilter = el('select',{}, el('option',{value:''},'همه دسته‌ها'));
  CATEGORIES.forEach(c=> catFilter.append(el('option',{value:c, selected: state.catFilter===c}, c)));
  catFilter.value = state.catFilter||'';
  searchIn.addEventListener('input', ()=>{ state.search = searchIn.value; renderList(); });
  catFilter.addEventListener('change', ()=>{ state.catFilter = catFilter.value; renderList(); });

  const listPanel = el('div',{class:'panel'},
    el('h3',{},'لیست کالاها (نزدیک‌ترین تاریخ انقضا در بالا)'),
    el('div',{class:'toolbar'}, searchIn, catFilter),
    el('div',{id:'productList'})
  );
  container.append(listPanel);

  function renderList(){
    const listEl = listPanel.querySelector('#productList');
    listEl.innerHTML = '';
    let items = DB.products(uid);
    if(state.search) items = items.filter(p=>p.name.includes(state.search));
    if(state.catFilter) items = items.filter(p=>p.category===state.catFilter);
    items.sort((a,b)=> daysUntil(a.expiryDate) - daysUntil(b.expiryDate));

    if(items.length===0){
      listEl.append(el('div',{class:'empty'}, el('div',{class:'big'},'📭'), el('div',{}, 'هیچ کالایی یافت نشد. یک کالای جدید ثبت کنید.')));
      return;
    }
    items.forEach(p=>{
      const days = daysUntil(p.expiryDate);
      const st = statusOf(days);
      const row = el('div',{class:'product'},
        el('div',{class:'badge '+st}),
        el('div',{class:'info'},
          el('div',{class:'name'}, p.name),
          el('div',{class:'meta'}, p.category)
        ),
        el('div',{class:'qty'}, `${p.quantity} عدد`),
        el('div',{class:'exp '+st},
          el('div',{class:'days'}, statusLabel(days)),
          el('div',{class:'date'}, isoToJalaliText(p.expiryDate))
        ),
        el('button',{class:'del', onclick:()=>{
          const list = DB.products(uid).filter(x=>x.id!==p.id);
          DB.saveProducts(uid, list); render();
        }}, '✕')
      );
      listEl.append(row);
    });
  }
  setTimeout(renderList, 0);

  return container;
}

render();
