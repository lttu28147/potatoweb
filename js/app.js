import {RoomVoice} from './room-voice.js';
import {CATEGORIES,TOPICS,QUESTS,DILEMMAS,TRUTH_PROMPTS,DARE_PROMPTS,SPY_PAIRS,RELAY_PHRASES} from './catalog.js';

const $=s=>document.querySelector(s);
const app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const trunc=(s,n=100)=>String(s??'').length>n?String(s).slice(0,n)+'…':String(s??'');
const nf=n=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1}).format(Number(n)||0);
const when=s=>{try{return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(s));}catch{return '';}};
const timeFmt=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.max(0,s)%60).padStart(2,'0')}`;
const choose=arr=>arr[Math.floor(Math.random()*arr.length)];
const ICONS={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',
 brain:'<path d="M12 18V5a3 3 0 0 0-6 0 4 4 0 0 0-1 7 4 4 0 0 0 1 7 3 3 0 0 0 6-1ZM12 18V5a3 3 0 0 1 6 0 4 4 0 0 1 1 7 4 4 0 0 1-1 7 3 3 0 0 1-6-1"/><path d="M8 8c2 0 4 1 4 3m4-3c-2 0-4 1-4 3"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 message:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
 spark:'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3z"/><path d="m19 17 .8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/>',
 heart:'<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6 5.4 5.4 0 0 0 0 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 leaf:'<path d="M11 20A7 7 0 0 1 4 13C4 6 13 4 21 3c-1 8-3 17-10 17z"/><path d="M4 21c5-7 8-10 14-14"/>',
 mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 bolt:'<path d="m13 2-9 11h7l-1 9 10-12h-7z"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 close:'<path d="M18 6 6 18M6 6l12 12"/>',
 share:'<path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 17v4h16v-4"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m5 4v7m4-7v7"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.4 9a7 7 0 0 1 12-3L20 12M4 12l2.6 6a7 7 0 0 0 12-3"/>',
 play:'<path d="m7 4 13 8-13 8z"/>',
 pause:'<path d="M8 4v16M16 4v16"/>',
 trophy:'<path d="M8 21h8M12 17v4M6 4h12v7a6 6 0 0 1-12 0z"/><path d="M6 6H3v3a4 4 0 0 0 4 4M18 6h3v3a4 4 0 0 1-4 4"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 edit:'<path d="M12 20h9M16 4l4 4-11 11-5 1 1-5z"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0"/>',
 volume:'<path d="M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
 repeat:'<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
 sliders:'<path d="M4 7h16M4 17h16M9 4v6m6 4v6"/>',
 flag:'<path d="M5 22V3m0 1c3-3 6 3 9 0 3-3 6 2 7 1v12c-4 2-5-2-9 0-3 2-4-1-7 0"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
 eyeoff:'<path d="m3 3 18 18M10.6 5.1c.5-.1 1-.1 1.4-.1 6 0 10 7 10 7a19 19 0 0 1-4.1 4.5M6.8 6.8C3.8 8.6 2 12 2 12s4 7 10 7c1.4 0 2.7-.4 3.9-1"/>',
 send:'<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4"/>',
 question:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 4m0 3h.01"/>'
};
const icon=(name,extra='')=>`<span class="ico ${extra}" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[name]||ICONS.spark}</svg></span>`;

const state={token:localStorage.getItem('potato_token')||localStorage.getItem('mach_token')||'',user:null,entries:[],questLogs:[],focusLogs:[],stats:{},config:{aiConnected:false},route:'dashboard',mobile:false,modal:null,game:null,room:null,roomEvents:null,roomDraft:'',roomMode:'circle',roomTeam:'against',journalFilter:'all',detailId:null,questCategory:'Tất cả',questSelected:null,recallId:null,recallStage:'answer',recallDraft:'',recallRating:2,
 thought:{stage:'pick',category:'all',topicId:'t01',customTopic:'',duration:60,speakDuration:60,deadline:0,original:'',coach:null,coachLoading:false,micReady:false,micNotice:'',showAll:false,revised:'',lesson:'',action:'',savedId:null,review:null,reviewStatus:'idle',reviewError:''},
 perspective:{step:0,dilemmaId:'d1',stance:'a',original:'',counter:'',lesson:'',savedId:null},
 focus:{duration:5,remaining:300,deadline:0,running:false,intention:'',logged:false},
 speech:{reference:'',transcript:'',recording:false,recordStart:0,seconds:0,feedback:null,recognized:false},
};
let recognition=null,recorder=null,audioChunks=[],localAudioUrl=null,speechClock=null,voiceTarget=null;
const roomVoice=new RoomVoice(request,updateRoomVoiceStatus);
function updateRoomVoiceStatus(){const panel=$('#room-voice-status');if(panel)panel.innerHTML=voiceStatusHtml();}
function voiceStatusHtml(){const v=roomVoice.status;return `<div class="voice-status-line"><span class="live-dot ${v.active&&!v.muted&&!v.locked?'live':''}"></span><strong>${v.active?(v.locked?'Chờ lượt nói · mic tự tắt':v.muted?'Micro đang tắt':'Micro đang bật'):'Micro chưa bật'}</strong><span class="muted tiny">${v.active?`${v.connected} kết nối thoại`:'Vẫn có thể trò chuyện bằng chữ'}</span></div>${v.error?`<p class="tiny" style="margin-top:5px;color:#9a6541">${e(v.error)}</p>`:''}`;}

function toast(message,error=false){const root=$('#toast-root');if(!root)return;const node=document.createElement('div');node.className='toast'+(error?' error':'');node.innerHTML=`${icon(error?'info':'check')}<span>${e(message)}</span>`;root.appendChild(node);setTimeout(()=>node.remove(),4200);}
async function request(url,body=null,method=body?'POST':'GET'){
  const headers={};if(state.token)headers.Authorization=`Bearer ${state.token}`;
  if(body!==null)headers['Content-Type']='application/json';
  let response;
  try{response=await fetch(url,{method,headers,body:body===null?undefined:JSON.stringify(body)});}catch{throw new Error('Không kết nối được máy chủ. Hãy kiểm tra server vẫn đang chạy.');}
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||`Lỗi ${response.status}`);
  return result;
}
async function refreshMe(renderAfter=true){
  const data=await request('/api/me');state.user=data.user;state.entries=data.entries;state.questLogs=data.questLogs;state.focusLogs=data.focusLogs;state.stats=data.stats;
  if(renderAfter)render();
}
function routeFromHash(){const parts=location.hash.slice(1).split('/').filter(Boolean);return parts[0]||'dashboard';}
function go(route){if(location.hash===`#/${route}`){render();return;}location.hash=`/${route}`;window.scrollTo({top:0,behavior:'instant'});}
function navigatePage(){if(voiceTarget){stopTranscription();}state.route=routeFromHash();if(state.route!=='rooms')roomVoice.stop();
  if(state.route!=='thought'&&['prepare','countdown','speak'].includes(state.thought.stage))state.thought.stage='pick';
  state.mobile=false;if(state.roomEvents&&state.route!=='rooms'){state.roomEvents.close();state.roomEvents=null;}
  if(state.route==='rooms'&&state.room?.code)subscribeRoom(state.room.code);
  render();window.scrollTo(0,0);
}
const menu=[
 {title:'BẮT ĐẦU',items:[['dashboard','home','Trang chủ'],['thought','mic','Nói & suy nghĩ'],['speech','message','Luyện thuyết trình'],['rooms','users','Phòng tranh luận']]},
 {title:'KHÁM PHÁ THÊM',items:[['perspective','layers','Đổi góc nhìn'],['focus','clock','Tập trung'],['recall','repeat','Ôn lại'],['quests','flag','Hành động thực tế'],['games','spark','Trò chơi nhóm'],['journal','book','Nhật ký'],['settings','sliders','Cài đặt']]}
];
const titles={dashboard:'Tổng quan',thought:'Tự nghĩ trước',perspective:'Đảo góc nhìn',focus:'Tập trung sâu',speech:'Luyện thuyết trình',recall:'Gợi nhớ chủ động',rooms:'Phòng tranh luận',quests:'Thử thách đời thực',games:'Trò chơi nhóm',journal:'Hành trình tư duy',settings:'Dữ liệu của tôi'};
function shell(content){
  const initials=e(state.user?.nickname?.trim()?.slice(0,1)?.toUpperCase()||'M');
  const nav=menu.map((group,i)=>i===0?`<div class="nav-label">${group.title}</div>${group.items.map(([id,sym,label])=>`<button type="button" data-go="${id}" class="nav-link ${state.route===id?'active':''}">${icon(sym)}<span>${label}</span></button>`).join('')}`:`<details class="extra-nav" ${group.items.some(([id])=>state.route===id)?'open':''}><summary>${icon('plus')} ${group.title.toLowerCase()}</summary>${group.items.map(([id,sym,label])=>`<button type="button" data-go="${id}" class="nav-link ${state.route===id?'active':''}">${icon(sym)}<span>${label}</span></button>`).join('')}</details>`).join('');
  return `<div class="mobile-backdrop ${state.mobile?'open':''}" data-action="sidebar-close"></div><div class="shell">
  <aside class="sidebar ${state.mobile?'open':''}">
    <a href="#/dashboard" class="brand potato-brand" aria-label="Trang chủ POTATO"><span class="potato-wordmark" role="img" aria-label="POTATO"><span>P</span><svg class="potato-glyph" viewBox="0 0 70 83" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="potato-brown-sidebar" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5D29D"/><stop offset=".55" stop-color="#DFAB68"/><stop offset="1" stop-color="#C8884D"/></linearGradient></defs><path d="M37 12c17-2 29 9 29 27 0 19-12 33-29 36C18 78 6 65 6 47 6 29 18 14 37 12Z" fill="url(#potato-brown-sidebar)" stroke="#9B653C" stroke-width="2.2"/><path d="M21 27c7-7 16-10 26-9" fill="none" stroke="#FFF0D2" stroke-width="3" stroke-linecap="round" opacity=".55"/><g fill="#98623F" opacity=".85"><ellipse cx="24" cy="38" rx="2.4" ry="1.65" transform="rotate(-28 24 38)"/><ellipse cx="44" cy="28" rx="2.3" ry="1.55" transform="rotate(20 44 28)"/><ellipse cx="50" cy="52" rx="2.2" ry="1.55" transform="rotate(-18 50 52)"/><ellipse cx="28" cy="59" rx="2.1" ry="1.5" transform="rotate(24 28 59)"/><ellipse cx="39" cy="45" rx="1.8" ry="1.25" transform="rotate(-12 39 45)"/></g></svg><span>TATO</span></span><span class="brand-sub">Think first. Live fully.</span></a>
    <nav aria-label="Điều hướng chính">${nav}</nav>
    <div class="sidebar-bottom"><div class="micro-note">${icon('spark')}<p><strong>Nguyên bản trước.<br>Công nghệ sau.</strong></p><p>Tự nghĩ. Nói thật. Kết nối.</p></div>
    <button class="side-profile" data-go="settings" style="width:100%;text-align:left"><span class="avatar">${initials}</span><span style="flex:1;min-width:0"><strong>${e(state.user?.nickname||'Bạn')}</strong><small>Xem hồ sơ và dữ liệu</small></span>${icon('chevron')}</button></div>
  </aside><div class="main-shell"><div class="topbar"><div class="flex-start"><button class="mobile-toggle" data-action="sidebar-open" aria-label="Mở menu">${icon('menu')}</button><span class="breadcrumb">Không gian của bạn &nbsp; / &nbsp; <strong>${e(titles[state.route]||'Tổng quan')}</strong></span></div><div class="top-actions"><span class="current-date">${new Intl.DateTimeFormat('vi-VN',{weekday:'short',day:'numeric',month:'short'}).format(new Date())}</span><span class="status ${state.config.aiConnected?'':'local'}"><i class="status-dot"></i>${state.config.aiConnected?'AI đã kết nối':'AI chưa kết nối'}</span></div></div>
  <main class="content" id="main-content">${content}</main></div></div>${state.modal||''}`;
}
function head(kicker,title,description,actions='') {return `<div class="page-head"><div><div class="page-kicker">${e(kicker)}</div><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div>${actions?`<div class="page-actions">${actions}</div>`:''}</div>`;}
function empty(title,message,route='',cta='Bắt đầu ngay') {return `<div class="empty">${icon('leaf')}<h3>${e(title)}</h3><p>${e(message)}</p>${route?`<button class="btn btn-primary" data-go="${route}">${e(cta)} ${icon('arrow')}</button>`:''}</div>`;}
function statsRow(){const st=state.stats;const items=[['brain','Bài tư duy',st.thoughts||0],['flag','Thử thách thực tế',st.quests||0],['clock','Phút tập trung',st.focusMinutes||0],['spark','Ngày học tập',st.days||0]];return `<div class="grid cols-4" style="gap:12px;margin-top:18px">${items.map(([ic,label,count],i)=>`<div class="stat-card"><div class="icon-tile ${i===1?'peach':i===2?'gold':'green'}">${icon(ic)}</div><div><div class="stat-num">${nf(count)}</div><div class="stat-name">${label}</div></div></div>`).join('')}</div>`;}
function dashboard(){
  const day=Math.floor(Date.now()/86400000),today=TOPICS[day%TOPICS.length];
  const recent=state.entries.slice(0,4);
  return `<div class="page-kicker">Chào mừng trở lại, ${e(state.user.nickname)} ✳</div>
  <section class="hero"><div class="hero-content"><div class="eyebrow">TƯ DUY ĐỘC LẬP • KẾT NỐI THẬT</div><h1>Tự nghĩ trước.<br><em>Tỏa sáng sau.</em></h1><p>Nói suy nghĩ của bạn, nhận góp ý và cùng bạn bè tranh luận.</p><div class="hero-actions"><button class="btn btn-lime" data-go="thought">Luyện nói ngay ${icon('arrow')}</button><button class="btn btn-light" data-go="rooms">Vào phòng tranh luận ${icon('users')}</button></div></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit o2"></div><div class="orbit o3"></div><div class="orbit o4"></div><div class="orbit-center"><svg class="potato-glyph" viewBox="0 0 70 83" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="potato-brown-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5D29D"/><stop offset=".55" stop-color="#DFAB68"/><stop offset="1" stop-color="#C8884D"/></linearGradient></defs><path d="M37 12c17-2 29 9 29 27 0 19-12 33-29 36C18 78 6 65 6 47 6 29 18 14 37 12Z" fill="url(#potato-brown-hero)" stroke="#9B653C" stroke-width="2.2"/><path d="M21 27c7-7 16-10 26-9" fill="none" stroke="#FFF0D2" stroke-width="3" stroke-linecap="round" opacity=".55"/><g fill="#98623F" opacity=".85"><ellipse cx="24" cy="38" rx="2.4" ry="1.65" transform="rotate(-28 24 38)"/><ellipse cx="44" cy="28" rx="2.3" ry="1.55" transform="rotate(20 44 28)"/><ellipse cx="50" cy="52" rx="2.2" ry="1.55" transform="rotate(-18 50 52)"/><ellipse cx="28" cy="59" rx="2.1" ry="1.5" transform="rotate(24 28 59)"/><ellipse cx="39" cy="45" rx="1.8" ry="1.25" transform="rotate(-12 39 45)"/></g></svg></div><div class="orbit-dot"></div><div class="orbit-dot two"></div><div class="floating-note fn1">✦ Dám nghĩ khác</div><div class="floating-note fn2">↗ Kết nối thật</div></div></section>
  ${statsRow()}
  <div class="section-title"><div><h2>Bắt đầu từ một điều nhỏ.</h2><p>Ba cách rèn tư duy mỗi ngày.</p></div></div>
  <div class="grid cols-3">
  ${[['01','brain','Tự nghĩ trước','Suy nghĩ rồi nói — AI góp ý sau.','thought'],['02','message','Tranh luận tử tế','Thảo luận vòng tròn hoặc Debate 3v3.','rooms'],['03','flag','Sống điều mình nghĩ','Thử thách tư duy trong đời thực.','quests']].map(([n,ic,t,d,r])=>`<button data-go="${r}" class="journey-card card-hover" style="text-align:left"><span class="journey-num">${n}</span><div class="icon-tile">${icon(ic)}</div><h3>${t}</h3><p>${d}</p></button>`).join('')}</div>
  <div class="section-title"><div><h2>Chủ đề hôm nay</h2><p>Một câu hỏi để bắt đầu.</p></div></div>
  <div class="grid cols-2"><section class="featured-topic"><span class="topic-decoration"></span><span class="pill lime">${icon('spark')} CHỦ ĐỀ HÔM NAY</span><h3>${e(today.title)}</h3><p>${e(today.prompt)}</p><button class="btn btn-primary" data-action="today-thought" data-id="${today.id}">Mình muốn thử ${icon('arrow')}</button></section>
  <section class="daily-invite"><div class="icon-tile peach">${icon('heart')}</div><h3>Đừng chỉ nghĩ. Hãy <span class="serif">làm.</span></h3><p>Một cuộc trò chuyện tử tế, một lần tự tìm lời giải hay mười phút rời điện thoại đều có thể tạo ra thay đổi.</p><div class="steps-line"><span class="step-line done"></span><span class="step-line ${state.stats.quests?'done':''}"></span><span class="step-line ${state.stats.quests>1?'done':''}"></span></div><button class="btn btn-light" data-go="quests">Khám phá thử thách ${icon('arrow')}</button></section></div>
  <div class="section-title"><div><h2>Những điều bạn đã nghĩ</h2><p>Mỗi lần ghi lại là một dấu mốc trên hành trình của riêng bạn.</p></div><button class="btn btn-light btn-small" data-go="journal">Xem tất cả ${icon('arrow')}</button></div>
  <div class="card">${recent.length?recent.map(x=>`<div class="recent-item"><div class="icon-tile">${icon(x.type==='speech'?'mic':x.type==='perspective'?'layers':'brain')}</div><div style="min-width:0;flex:1"><div class="recent-title">${e(x.topic)}</div><div class="recent-sub">${when(x.createdAt)} • ${x.type==='speech'?'Luyện nói':x.type==='perspective'?'Đảo góc nhìn':'Bài tư duy'}</div></div><button class="btn btn-light btn-small" data-action="journal-detail" data-id="${x.id}">Xem</button></div>`).join(''):empty('Chưa có bản ghi đầu tiên','Bạn có thể bắt đầu bằng một chủ đề chỉ trong 60 giây.','thought','Nói suy nghĩ đầu tiên')}</div>`;
}
function onboarding(){return `<div class="onboard-layout"><section class="onboard-left"><div><div class="brand potato-brand onboard-brand" style="padding:0 0 64px"><span class="potato-wordmark" role="img" aria-label="POTATO"><span>P</span><svg class="potato-glyph" viewBox="0 0 70 83" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="potato-brown-onboard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5D29D"/><stop offset=".55" stop-color="#DFAB68"/><stop offset="1" stop-color="#C8884D"/></linearGradient></defs><path d="M37 12c17-2 29 9 29 27 0 19-12 33-29 36C18 78 6 65 6 47 6 29 18 14 37 12Z" fill="url(#potato-brown-onboard)" stroke="#9B653C" stroke-width="2.2"/><path d="M21 27c7-7 16-10 26-9" fill="none" stroke="#FFF0D2" stroke-width="3" stroke-linecap="round" opacity=".55"/><g fill="#98623F" opacity=".85"><ellipse cx="24" cy="38" rx="2.4" ry="1.65" transform="rotate(-28 24 38)"/><ellipse cx="44" cy="28" rx="2.3" ry="1.55" transform="rotate(20 44 28)"/><ellipse cx="50" cy="52" rx="2.2" ry="1.55" transform="rotate(-18 50 52)"/><ellipse cx="28" cy="59" rx="2.1" ry="1.5" transform="rotate(24 28 59)"/><ellipse cx="39" cy="45" rx="1.8" ry="1.25" transform="rotate(-12 39 45)"/></g></svg><span>TATO</span></span></div><div class="eyebrow" style="color:#c6dca1;margin-bottom:22px">NGHĨ TRƯỚC. KẾT NỐI SÂU.</div><h1>Đừng đánh mất<br><em>tiếng nói</em><br>của chính mình.</h1><p>POTATO là không gian để bạn luyện suy nghĩ độc lập, tranh luận tử tế và mang những điều đã học trở về đời thực.</p></div><div style="color:#abc8b4;font-size:12px;z-index:2">Một sản phẩm được xây dựng cho học sinh, sinh viên. ✳</div><div class="onboard-swirls"></div></section><section class="onboard-right"><div class="onboard-form"><span class="pill lime">${icon('spark')} CHÀO MỪNG BẠN</span><h2>Hãy bắt đầu bằng<br><span class="serif">chính bạn.</span></h2><p>Chọn một tên hiển thị để bắt đầu.</p><form data-form="onboarding" class="stack" style="gap:13px"><div class="field"><label for="nickname">Mọi người nên gọi bạn là gì?</label><input id="nickname" class="input" name="nickname" maxlength="35" minlength="2" required placeholder="Ví dụ: Minh Anh" autocomplete="nickname"></div><button class="btn btn-primary btn-block" type="submit">Vào không gian POTATO ${icon('arrow')}</button></form><div class="separator"></div><div class="onboard-benefit"><span class="icon-tile">${icon('lock')}</span><div><strong>Bạn sở hữu câu chuyện của mình</strong><p>Xem, xuất dữ liệu và xóa mọi bản ghi bất kỳ lúc nào.</p></div></div><div class="onboard-benefit"><span class="icon-tile peach">${icon('brain')}</span><div><strong>AI luôn đến sau</strong><p>Người dùng tự nói quan điểm trước khi có gợi hỏi từ công nghệ.</p></div></div><div class="onboard-benefit"><span class="icon-tile gold">${icon('users')}</span><div><strong>Rủ bạn cùng tham gia</strong><p>Tạo phòng bằng mã mời, cùng học cách lắng nghe và phản biện.</p></div></div><p class="tiny muted" style="margin-top:23px">Dữ liệu được lưu trên máy chạy website. Đây là phiên bản dự án thử nghiệm, không dùng để lưu thông tin nhạy cảm.</p></div></section></div>`;}
function render(){
  if(!state.user){app.innerHTML=onboarding();return;}
  const pages={dashboard,thought,perspective,focus,speech,recall,rooms,quests,games,journal,settings};
  try{app.innerHTML=shell((pages[state.route]||dashboard)());}catch(err){console.error(err);app.innerHTML=shell(`<div class="card">Không thể hiển thị trang này. <button class="btn btn-primary" data-go="dashboard">Về trang chủ</button></div>`);toast('Lỗi hiển thị, thử tải lại trang.',true);}
}
function resetThought(){stopTranscription();state.thought={stage:'pick',category:'all',topicId:'t01',customTopic:'',duration:60,speakDuration:60,deadline:0,original:'',coach:null,coachLoading:false,micReady:false,micNotice:'',showAll:false,revised:'',lesson:'',action:'',savedId:null,review:null,reviewStatus:'idle',reviewError:''};}
function thoughtTopic(){const t=state.thought;return t.topicId==='custom'?(t.customTopic||'Chủ đề của riêng mình'):TOPICS.find(x=>x.id===t.topicId)?.title||TOPICS[0].title;}
function renderThoughtReview(review){
  if(!review)return '';
  const isAI=review.mode==='ai';
  return `<div class="ai-review-panel"><div class="ai-review-intro"><div class="ai-review-icon">${icon(isAI?'spark':'book')}</div><div style="flex:1"><span class="pill ${isAI?'lime':'gold'}">${e(review.label|| (isAI?'AI nhận xét':'Gợi ý theo quy tắc'))}</span><h3 style="margin:11px 0 8px">Nhìn lại bài nói của bạn</h3><p>${e(review.overview||'')}</p></div></div>
  ${review.changes?.length?`<div class="review-change"><strong>${icon('refresh')} Điều đã thay đổi</strong><div class="review-list">${review.changes.map(x=>`<p>${e(x)}</p>`).join('')}</div></div>`:''}
  <div class="review-columns"><div class="review-card good"><h4>${icon('check')} Điểm bạn đang làm tốt</h4><ul>${(review.strengths||[]).map(x=>`<li>${e(x)}</li>`).join('')}</ul></div>
  <div class="review-card improve"><h4>${icon('target')} Điều nên cải thiện</h4><ul>${(review.improvements||[]).map(x=>`<li>${e(x)}</li>`).join('')}</ul></div></div>
  <div class="review-next"><strong>${icon('mic')} Gợi ý cho lượt nói tiếp theo</strong><p>${e(review.nextTry||'')}</p>${review.question?`<p class="review-question">${icon('question')} ${e(review.question)}</p>`:''}</div>
  <p class="review-disclaimer">${icon('info')} ${e(review.notice||'AI có thể nhầm lẫn; hãy tự đánh giá và đối chiếu với trải nghiệm thực tế.')}</p></div>`;
}
async function fetchThoughtReview(t){
  t.reviewStatus='loading';t.reviewError='';
  if(state.thought===t&&state.route==='thought')render();
  try{
    const res=await request('/api/thought-review',{topic:thoughtTopic(),original:t.original,revised:t.revised,lesson:t.lesson,...(t.savedId?{entryId:t.savedId}:{})});
    t.review=res.review;t.reviewStatus='ready';
    if(t.savedId)await refreshMe(false);
  }catch(err){t.reviewStatus='error';t.reviewError=err.message||'Không thể lấy nhận xét.';}
  if(state.thought===t&&state.route==='thought')render();
}
function thought(){
  const t=state.thought;
  const steps=[['pick','Chọn'],['prepare','Nghĩ'],['speak','Nói'],['coach','Góp ý']];
  const pos=t.stage==='pick'?0:t.stage==='prepare'?1:['countdown','speak','captured'].includes(t.stage)?2:3;
  const stepper=`<div class="potato-steps" aria-label="Các bước luyện tập">${steps.map(([id,name],i)=>`<div class="potato-step ${i===pos?'active':i<pos?'complete':''}"><span>${i<pos?'✓':i+1}</span>${name}</div>`).join('')}</div>`;
  let contents='';
  if(t.stage==='pick'){
    const filtered=t.category==='all'?TOPICS:TOPICS.filter(x=>x.category===t.category);
    const featured=t.showAll?filtered:filtered.slice(0,4);
    contents=`<div class="exercise-intro"><div><span class="eyebrow">BẮT ĐẦU TỪ BẠN</span><h2>Hôm nay mình nghĩ gì?</h2><p>Chọn một câu hỏi. POTATO sẽ tự chuyển từ suy nghĩ sang nói.</p></div><button class="btn btn-light" data-action="think-random">${icon('refresh')} Bốc ngẫu nhiên</button></div>
      <div class="topic-grid potato-topics">${featured.map(x=>`<button data-action="think-select" data-id="${x.id}" class="topic-card ${t.topicId===x.id?'selected':''}"><span class="topic-check">${t.topicId===x.id?'✓':'↗'}</span><h3>${e(x.title)}</h3></button>`).join('')}</div>
      <div class="compact-link-row"><button class="text-button" data-action="think-show-all">${t.showAll?'Thu gọn chủ đề':'Xem tất cả chủ đề'} ${icon('arrow')}</button><button class="text-button" data-action="think-select" data-id="custom">Tự đặt câu hỏi ${icon('edit')}</button></div>
      ${t.topicId==='custom'?`<div class="field" style="margin-top:15px"><label for="think-custom-topic">Câu hỏi của bạn</label><input class="input" id="think-custom-topic" maxlength="160" placeholder="Ví dụ: Chúng ta nên học như thế nào khi có AI?" value="${e(t.customTopic)}"></div>`:''}
      <div class="session-options"><div><strong>Thời gian suy nghĩ</strong><div class="radio-pills">${[15,60,120].map(n=>`<button data-action="think-duration" data-id="${n}" class="choice ${t.duration===n?'active':''}">${n===15?'15 giây':n===60?'1 phút':'2 phút'}</button>`).join('')}</div></div>
      <div><strong>Thời gian nói</strong><div class="radio-pills">${[45,60,90].map(n=>`<button data-action="think-speak-duration" data-id="${n}" class="choice ${t.speakDuration===n?'active':''}">${n} giây</button>`).join('')}</div></div></div>
      <div class="launch-row"><div><strong>${icon('mic')} Micro được hỏi quyền trước khi bắt đầu</strong><p>Suy nghĩ → 3, 2, 1 → tự bật thời gian nói và nhận dạng giọng nói.</p></div><button class="btn btn-primary btn-launch" data-action="think-start">Bắt đầu ${icon('arrow')}</button></div>`;
  }else if(t.stage==='prepare'){
    const rem=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    contents=`<div class="solo-stage prep-stage"><span class="stage-tag">${icon('lock')} KHÔNG AI • KHÔNG ÁP LỰC</span><h2>${e(thoughtTopic())}</h2><div class="flow-clock" id="think-clock">${timeFmt(rem)}</div><div class="flow-caption">Thời gian suy nghĩ</div><div class="flow-progress"><span id="think-progress" style="width:${(1-rem/t.duration)*100}%"></span></div><p class="solo-hint">Tìm một quan điểm, một lý do và một ví dụ.</p><p class="tiny muted">Hết giờ, POTATO sẽ đếm 3–2–1 rồi tự bật lượt nói ${t.speakDuration} giây.</p>${t.micNotice?`<div class="mic-soft-warning">${icon('info')} ${e(t.micNotice)}</div>`:''}</div>`;
  }else if(t.stage==='countdown'){
    const rem=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    contents=`<div class="solo-stage countdown-stage" aria-live="assertive"><span class="stage-tag">CHUẨN BỊ LÊN TIẾNG</span><h2>${e(thoughtTopic())}</h2><div class="flow-count" id="think-countdown">${Math.max(1,rem)}</div><div class="flow-caption">Sẵn sàng nói!</div><p class="solo-hint">Không cần bấm thêm nút nào.</p></div>`;
  }else if(t.stage==='speak'){
    const rem=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    contents=`<div class="solo-stage speak-stage"><span class="stage-tag">${icon('mic')} ĐẾN LƯỢT BẠN NÓI</span><h2>${e(thoughtTopic())}</h2><div class="flow-clock" id="think-speak-clock">${timeFmt(rem)}</div><div class="flow-caption"><span class="live-dot ${voiceTarget==='think-original'?'live':''}"></span><span id="thought-mic-label">${voiceTarget==='think-original'?'Đang nghe và ghi lời nói':'Đang tính thời gian nói'}</span></div><div class="flow-progress"><span id="think-speak-progress" style="width:${(1-rem/t.speakDuration)*100}%"></span></div>
      <div class="compact-transcript"><label for="think-original">Lời bạn đang nói <span class="tiny muted">(có thể chỉnh lại nếu nhận dạng sai)</span></label><textarea id="think-original" class="textarea" maxlength="7000" placeholder="Bản chép lời của bạn sẽ xuất hiện ở đây…">${e(t.original)}</textarea></div>
      <div class="solo-actions"><button class="btn btn-light" data-action="voice-toggle" data-id="think-original">${icon('mic')} ${voiceTarget==='think-original'?'Tắt mic':'Bật lại mic'}</button><button class="btn btn-primary" data-action="think-finish-speak">Kết thúc và xem góp ý ${icon('arrow')}</button></div>
      ${t.micNotice?`<p class="tiny muted">${e(t.micNotice)}</p>`:''}<p class="tiny muted">Hết giờ, POTATO tự dừng lượt nói và chuyển sang góp ý.</p></div>`;
  }else if(t.stage==='captured'){
    contents=`<div class="solo-stage captured-stage"><span class="stage-tag">ĐÃ KẾT THÚC LƯỢT NÓI</span><h2>Đây là lời của bạn.</h2><p class="muted">Kiểm tra bản chép và lấy góp ý. Bạn có thể sửa những từ hệ thống nghe nhầm.</p><div class="compact-transcript"><label for="think-original">Bản chép lời</label><textarea class="textarea tall" id="think-original" maxlength="7000" placeholder="Bạn có thể nhập nội dung nếu micro không hoạt động…">${e(t.original)}</textarea><span id="think-write-hint" class="field-hint">${t.original.length} ký tự</span></div>${t.coachLoading?`<div class="review-loading"><span class="review-spinner"></span> POTATO đang chuẩn bị câu hỏi…</div>`:''}<div class="solo-actions"><button class="btn btn-primary" id="think-coach-btn" data-action="think-coach" ${t.coachLoading||t.original.trim().length<20?'disabled':''}>${icon('spark')} Nhận góp ý</button><button class="btn btn-light" data-action="think-speak-again">${icon('refresh')} Nói lại</button></div>${t.micNotice?`<p class="tiny muted">${e(t.micNotice)}</p>`:''}</div>`;
  }else if(t.stage==='coach'){
    const c=t.coach||{};
    contents=`<div class="exercise-intro"><div><span class="eyebrow">PHẦN 2 • NHÌN LẠI</span><h2>Nghĩ sâu hơn một chút.</h2><p>AI gợi mở, bạn tự quyết định điều mình nghĩ.</p></div><span class="pill ${c.mode==='ai'?'lime':'gold'}">${e(c.label||'Gợi hỏi theo mẫu')}</span></div>
      <div class="coach-focus"><div class="coach-prompt"><div class="eyebrow">THỬ TRẢ LỜI 3 CÂU NÀY</div>${(c.questions||[]).slice(0,3).map((q,i)=>`<div class="prompt-question"><b>${i+1}</b><span>${e(q)}</span></div>`).join('')}</div><div class="coach-tips"><h3>Gợi ý cải thiện</h3>${(c.suggestions||[]).slice(0,3).map(x=>`<p>${icon('check')} ${e(x)}</p>`).join('')}</div></div>
      <form data-form="think-save" class="compact-finish-form"><div class="field"><label for="think-revised">Nói lại sau góp ý <span class="tiny muted">(hoặc nhập chữ)</span></label><textarea class="textarea tall" id="think-revised" name="revised" required minlength="20" placeholder="Mình nhận thấy rằng…">${e(t.revised)}</textarea><div class="solo-actions"><button type="button" class="btn btn-light" data-action="voice-toggle" data-id="think-revised">${icon('mic')} ${voiceTarget==='think-revised'?'Dừng mic':'Nói lại bằng micro'}</button></div></div><div class="field"><label>Điều mình rút ra</label><textarea name="lesson" class="textarea" minlength="10" required placeholder="Một điều mình vừa hiểu hơn là…">${e(t.lesson)}</textarea></div><details class="optional-field"><summary>+ Thêm một hành động mình muốn thử (tùy chọn)</summary><input name="action" class="input" maxlength="1000" placeholder="Ví dụ: rủ bạn thảo luận về chủ đề này" value="${e(t.action)}"></details><div class="solo-actions"><button class="btn btn-primary btn-launch" type="submit">Hoàn tất và xem tổng kết ${icon('arrow')}</button><button type="button" class="btn btn-light" data-action="think-back-write">Sửa bản chép ban đầu</button></div></form><p class="tiny muted" style="margin-top:14px">${e(c.notice||'Gợi ý AI có thể chưa chính xác.')}</p>`;
  }else{
    contents=`<div class="success-hero"><div class="success-icon">${icon('check')}</div><span class="pill lime">HOÀN THÀNH!</span><h2 style="margin-top:13px">Một lượt nói. <span class="serif">Một bước tiến.</span></h2><p>Bạn đã tự nghĩ, tự nói, rồi nhìn lại quan điểm.</p></div>
      <div class="section-title" style="margin:24px 0 13px"><h2>Góp ý dành cho bạn</h2></div>
      ${t.reviewStatus==='loading'?`<div class="review-loading" role="status"><span class="review-spinner"></span><strong>Đang tổng hợp nhận xét…</strong></div>`:t.review?renderThoughtReview(t.review):`<div class="review-loading"><div><strong>Chưa thể lấy nhận xét.</strong><p>${e(t.reviewError||'Thử lại để xem góp ý.')}</p><button class="btn btn-primary btn-small" data-action="think-review-retry">Thử lại</button></div></div>`}
      <details class="optional-field" style="margin-top:15px"><summary>Xem hai phiên bản bài nói</summary><div class="result-compare" style="margin-top:12px"><div class="comparison-col"><h4>Trước</h4><p>${e(t.original)}</p></div><div class="comparison-col after"><h4>Sau</h4><p>${e(t.revised)}</p></div></div></details>
      <div class="solo-actions" style="margin-top:20px"><button class="btn btn-primary" data-action="think-reset">Thử chủ đề mới ${icon('arrow')}</button><button class="btn btn-light" data-go="journal">Nhật ký</button></div>`;
  }
  return `<div class="streamlined-page">${head('NÓI & SUY NGHĨ','Nói điều <span class="serif">bạn thật sự nghĩ.</span>','Một câu hỏi. Một phút. Một tiếng nói của riêng bạn.',t.stage!=='pick'?`<button class="btn btn-light btn-small" data-action="think-reset">Đổi chủ đề</button>`:'')}
    <section class="potato-workspace">${stepper}${contents}</section></div>`;
}


// Request permission from a REAL user click, before the study timer or room join begins.
async function askMicrophonePermission(){
  if(!navigator.mediaDevices?.getUserMedia)return {ok:false,message:'Thiết bị chưa hỗ trợ micro trên trang này. Dùng HTTPS hoặc localhost và Chrome/Edge.'};
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false});
    stream.getTracks().forEach(track=>track.stop());
    if(!(window.SpeechRecognition||window.webkitSpeechRecognition))return {ok:false,message:'Micro đã được cấp quyền nhưng trình duyệt chưa hỗ trợ chép giọng nói. Bạn có thể nhập chữ.'};
    return {ok:true,message:''};
  }catch(err){return {ok:false,message:err?.name==='NotAllowedError'?'Bạn chưa cho phép micro. Có thể bật lại trong cài đặt trang hoặc nhập chữ.':'Không mở được micro, bạn vẫn có thể nhập chữ.'};}
}
function stopTranscription(){
  const old=recognition;recognition=null;voiceTarget=null;
  if(old){old.onend=null;old.onerror=null;old.onresult=null;try{old.stop();}catch{}}
}
function startTranscription(target,{automatic=false}={}){
  const C=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!C)throw new Error('Trình duyệt không hỗ trợ nhận dạng giọng nói. Dùng Chrome/Edge và cho phép micro.');
  const node=document.getElementById(target);if(!node)throw new Error('Không tìm thấy ô bản chép lời.');
  stopTranscription();
  const base=node.value.trim(),r=new C();r.lang='vi-VN';r.continuous=true;r.interimResults=true;recognition=r;voiceTarget=target;
  r.onresult=event=>{
    let heard='';for(const result of Array.from(event.results))heard+=(result[0]?.transcript||'')+' ';
    const value=[base,heard.trim()].filter(Boolean).join(' ');
    if(target==='think-original')state.thought.original=value;
    if(target==='think-revised')state.thought.revised=value;
    if(target==='room-position-text')state.roomDraft=value;
    if(target==='room-message-text')state.roomDraftMessage=value;
    const area=document.getElementById(target);if(area){area.value=value;area.dispatchEvent(new Event('input',{bubbles:true}));}
  };
  r.onerror=ev=>{
    if(recognition!==r)return;
    voiceTarget=null;recognition=null;
    if(target==='think-original')state.thought.micNotice=ev.error==='not-allowed'?'Micro bị chặn. Bạn có thể nhập nội dung vào ô bên dưới.':'Nhận dạng giọng nói bị gián đoạn; bạn có thể bấm Bật lại mic.';
    toast(ev.error==='not-allowed'?'Hãy cấp quyền micro hoặc nhập chữ.':'Không thể tiếp tục nhận dạng giọng nói.',true);
    updateVoiceButtons();
  };
  r.onend=()=>{
    if(recognition!==r)return;
    recognition=null;voiceTarget=null;
    updateVoiceButtons();
    if(automatic && target==='think-original'&&state.thought.stage==='speak'&&Date.now()<state.thought.deadline-1200){
      // Chrome SpeechRecognition may stop after silence. Attempt to resume once.
      if((state.thought.voiceRestarts||0)<4){
        state.thought.voiceRestarts=(state.thought.voiceRestarts||0)+1;
        setTimeout(()=>{if(state.thought.stage==='speak'&&!voiceTarget){try{startTranscription(target,{automatic:true});}catch{}}},350);
      }
    }
  };
  try{r.start();}catch(err){stopTranscription();throw new Error('Không tự bật được nhận dạng giọng nói; bấm Bật lại mic để thử tiếp.');}
  updateVoiceButtons();
}
function updateVoiceButtons(){
  const txt=$('#thought-mic-label');if(txt)txt.textContent=voiceTarget==='think-original'?'Đang nghe và ghi lời nói':'Đang tính thời gian nói';
  const status=$('#room-voice-transcribing');if(status)status.textContent=voiceTarget?.startsWith('room-')?'Đang chuyển lời nói thành chữ…':'';
}
async function coachThoughtAfterSpeech(t){
  if(t.stage!=='captured'||t.original.trim().length<20||t.coachLoading)return;
  t.coachLoading=true;render();
  try{t.coach=await request('/api/coach',{topic:thoughtTopic(),response:t.original.trim()});t.stage='coach';}
  catch(err){t.micNotice='Chưa lấy được góp ý: '+err.message;toast(t.micNotice,true);}
  finally{t.coachLoading=false;if(state.thought===t&&state.route==='thought')render();}
}
function finishThoughtSpeak(){
  const t=state.thought;
  if(t.stage!=='speak')return;
  t.stage='captured';stopTranscription();render();
  // Allow final speech results to flush, then continue automatically if useful text exists.
  setTimeout(()=>{if(state.thought===t&&t.stage==='captured'&&t.original.trim().length>=20)coachThoughtAfterSpeech(t);},500);
}
function beginThoughtSpeech(){
  const t=state.thought;
  if(t.stage!=='countdown')return;
  t.stage='speak';t.deadline=Date.now()+t.speakDuration*1000;t.voiceRestarts=0;render();
  if(t.micReady){try{startTranscription('think-original',{automatic:true});}catch(err){t.micNotice=err.message;toast(err.message,true);updateVoiceButtons();}}
}

function perspective(){
  const p=state.perspective, d=DILEMMAS.find(x=>x.id===p.dilemmaId)||DILEMMAS[0];
  let content='';
  if(p.step===0){content=`<div class="grid cols-2"><div class="field"><label>Chọn tình huống muốn suy ngẫm</label><select id="perspective-topic" class="select">${DILEMMAS.map(x=>`<option value="${x.id}" ${x.id===p.dilemmaId?'selected':''}>${e(x.title)}</option>`).join('')}</select></div><div class="field"><label>Quan điểm bạn muốn bắt đầu</label><div class="radio-pills">${[['a','Đồng ý với A'],['b','Đồng ý với B']].map(([key,v])=>`<button data-action="perspective-stance" data-id="${key}" class="choice ${p.stance===key?'active':''}">${v}</button>`).join('')}</div></div></div>
  <div class="grid cols-2" style="margin:18px 0"><div class="point-card" style="background:${p.stance==='a'?'#edf3e5':'#fff'}"><span class="pill lime">GÓC NHÌN A</span><h3 style="margin-top:10px">${e(d.a)}</h3></div><div class="point-card" style="background:${p.stance==='b'?'#edf3e5':'#fff'}"><span class="pill gold">GÓC NHÌN B</span><h3 style="margin-top:10px">${e(d.b)}</h3></div></div>
  <div class="notice">${icon('lock')} Giai đoạn 1: viết lý lẽ của riêng bạn. Chưa xem gợi ý đối lập.</div>
  <div class="field" style="margin-top:20px"><label for="perspective-original">Tại sao bạn chọn quan điểm này?</label><textarea class="textarea tall" id="perspective-original" placeholder="Mình chọn phía này bởi vì… Ví dụ…" minlength="20">${e(p.original)}</textarea><span class="field-hint">Ít nhất 20 ký tự để bước tiếp.</span></div><button class="btn btn-primary" style="margin-top:16px" data-action="perspective-next">Thử bước sang phía đối lập ${icon('arrow')}</button>`;}
  else if(p.step===1){const other=p.stance==='a'?d.b:d.a;
    content=`<div class="notice info">Bạn đã tự ghi lại quan điểm ban đầu. Giờ hãy thử xây dựng lập luận từ phía ngược lại, ngay cả khi bạn không đồng ý.</div>
    <div class="point-card" style="margin:19px 0;background:#f1f6e9"><span class="pill gold">PERSPECTIVE SWITCH</span><h2 style="margin-top:10px">${e(other)}</h2><p style="margin-top:11px">Gợi ý quan sát: ${e(d.hint)}</p></div>
    <form data-form="perspective-save" class="stack"><div class="field"><label>Hãy bảo vệ góc nhìn ngược lại một cách công bằng</label><textarea name="counter" class="textarea tall" required minlength="20" placeholder="Nếu là người tin vào góc nhìn kia, mình sẽ lập luận rằng…">${e(p.counter)}</textarea></div><div class="field"><label>Bây giờ bạn nhìn vấn đề như thế nào?</label><textarea name="lesson" class="textarea" required minlength="15" placeholder="Mình vẫn giữ / điều chỉnh quan điểm vì…">${e(p.lesson)}</textarea></div><div class="button-row"><button class="btn btn-primary" type="submit">${state.user.privacy.saveHistory?'Lưu bản đồ góc nhìn':'Hoàn tất không lưu'} ${icon('arrow')}</button><button type="button" class="btn btn-light" data-action="perspective-back">${icon('back')} Quay lại</button></div></form>`;}
  else{content=`<div class="success-hero"><div class="success-icon">${icon('layers')}</div><h2>Bạn vừa nhìn vấn đề từ <span class="serif">hai phía.</span></h2><p>Thấu hiểu lý lẽ đối lập không có nghĩa là từ bỏ chính kiến. Đây là một bước luyện sự công bằng trong tư duy.</p></div><div class="result-compare"><div class="comparison-col"><h4>QUAN ĐIỂM BAN ĐẦU</h4><p>${e(p.original)}</p></div><div class="comparison-col after"><h4>LÝ LẼ TỪ PHÍA ĐỐI LẬP</h4><p>${e(p.counter)}</p></div></div><div class="point-card" style="margin-top:16px"><strong>Điều bạn rút ra</strong><p style="margin-top:8px">${e(p.lesson)}</p></div><div class="button-row" style="margin-top:18px"><button class="btn btn-primary" data-action="perspective-reset">Thử góc nhìn khác ${icon('refresh')}</button><button class="btn btn-light" data-go="journal">Hành trình của tôi</button></div>`;}
  return `${head('PERSPECTIVE SWITCH','Khác quan điểm, <span class="serif">không khác lòng tôn trọng.</span>','Tự bảo vệ lập trường của mình, rồi chủ động thử nhìn vấn đề từ phía đối lập.')}
  <section class="panel"><div class="flex-start" style="margin-bottom:22px"><span class="pill ${p.step===0?'lime':''}">01 • Góc nhìn đầu tiên</span>${icon('arrow')}<span class="pill ${p.step===1?'lime':''}">02 • Đổi vai</span>${icon('arrow')}<span class="pill ${p.step===2?'lime':''}">03 • Tự đúc kết</span></div>${content}</section>`;
}
function focus(){
  const f=state.focus,remaining=f.running?Math.ceil(Math.max(0,f.deadline-Date.now())/1000):f.remaining;
  const durations=[1,5,15,25];
  return `${head('DEEP FOCUS','Tập trung là một <span class="serif">sự lựa chọn.</span>','Không thông báo, không gợi ý AI. Chọn một việc, dành cho nó sự chú ý trọn vẹn.')}
  <div class="focus-stage"><section class="focus-clock-panel"><span class="eyebrow" style="color:#c7dcab">MỘT VIỆC. MỘT KHOẢNG THỜI GIAN.</span><div class="focus-clock" id="focus-clock">${timeFmt(remaining)}</div><div style="max-width:410px"><div class="progress-track" style="background:#426e55"><div id="focus-progress" class="progress-fill" style="background:#d7e89d;width:${(1-remaining/(f.duration*60))*100}%"></div></div></div><p style="margin:18px 0 18px">${f.running?'Đang tập trung. Bạn không cần tương tác với trang trong lúc này.':f.remaining<f.duration*60?'Đang tạm dừng. Nhấn tiếp tục khi sẵn sàng.':'Cứ chọn một việc trước. Mọi thứ khác có thể chờ.'}</p><div class="button-row">${f.running?`<button class="btn btn-lime" data-action="focus-pause">${icon('pause')} Tạm dừng</button>`:`<button class="btn btn-lime" data-action="focus-start">${icon('play')} ${f.remaining<f.duration*60?'Tiếp tục':'Bắt đầu tập trung'}</button>`}<button class="btn btn-light" data-action="focus-reset">${icon('refresh')} Đặt lại</button></div><div class="focus-record">Bạn đã tập trung ${nf(state.stats.focusMinutes||0)} phút được ghi nhận trên POTATO.</div></section>
  <div class="stack"><section class="card"><div class="icon-tile">${icon('target')}</div><h3 style="margin-top:14px">Hôm nay bạn chọn tập trung vào điều gì?</h3><p class="muted tiny" style="margin:7px 0 13px">Hãy chọn một công việc thật sự rõ ràng, không phải “học bài” chung chung.</p><textarea id="focus-intention" class="textarea" maxlength="300" style="min-height:90px" placeholder="Ví dụ: Tự giải 2 bài toán rời rạc mà không dùng AI…" ${f.running?'disabled':''}>${e(f.intention)}</textarea><div class="field-label" style="margin:16px 0 8px">Thời lượng</div><div class="radio-pills">${durations.map(x=>`<button ${f.running||f.remaining<f.duration*60?'disabled':''} data-action="focus-duration" data-id="${x}" class="choice ${f.duration===x?'active':''}">${x===1?'1 phút • demo':x+' phút'}</button>`).join('')}</div></section>
  <section class="card"><h3>Ba cách giữ tập trung</h3><div class="separator" style="margin:12px 0"></div><div class="tip-list"><div class="tip"><div class="icon-tile">${icon('volume')}</div><div><strong>Tắt thông báo</strong><p>Website không thể chặn thông báo của thiết bị. Hãy bật chế độ Không làm phiền.</p></div></div><div class="tip"><div class="icon-tile peach">${icon('edit')}</div><div><strong>Thử ghi ra giấy</strong><p>Rời khỏi màn hình, phác thảo hướng đi của chính bạn.</p></div></div><div class="tip"><div class="icon-tile gold">${icon('check')}</div><div><strong>Hoàn thành một việc nhỏ</strong><p>Ưu tiên tiến bộ thật thay vì giữ chuỗi ngày bằng mọi giá.</p></div></div></div></section></div></div>`;
}
function getSpeechMetrics(transcript,seconds=0,reference=''){
  const t=String(transcript||'').trim();const words=t.split(/\s+/).filter(Boolean);const n=words.length;
  const fillers=(t.match(/(?:^|[\s,.!?;:])(ừm|ờ|à|kiểu như|nói chung|thì là)(?=[\s,.!?;:]|$)/gim)||[]).length;
  const intro=/mở đầu|xin chào|hôm nay|vấn đề|chủ đề|trước tiên/i.test(t),body=/thứ nhất|thứ hai|đầu tiên|tiếp theo|bởi vì|ví dụ|ngoài ra|mặt khác/i.test(t),end=/cuối cùng|tóm lại|kết luận|cảm ơn|bài học|vì vậy/i.test(t);
  const clean=s=>new Set((s||'').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(x=>x.length>3));
  const refWords=clean(reference),spoken=clean(t);
  const overlap=refWords.size?Array.from(refWords).filter(w=>spoken.has(w)).length/refWords.size:null;
  const structureScore=(intro?20:0)+(body?30:0)+(end?20:0)+(n>=85?20:n>=45?12:n>=20?6:0)+(fillers<=3?10:fillers<=7?5:0);
  return {words:n,fillers,structureScore,durationSeconds:seconds,wpm:seconds>10?Math.round(n/(seconds/60)):0,
    hasIntro:intro,hasBody:body,hasEnd:end,overlap,
    tips:[intro?'Đã có dấu hiệu mở đầu/giới thiệu chủ đề.':'Hãy thử mở đầu bằng một câu đặt vấn đề rõ ràng.',body?'Đã có dấu hiệu phát triển ý hoặc dẫn chứng.':'Hãy thêm lý do, ví dụ và liên kết giữa các ý.',end?'Đã có dấu hiệu tổng kết.':'Thử kết thúc bằng một thông điệp mà người nghe nhớ được.',fillers>4?'Bạn có nhiều từ đệm trong bản chép. Thử ngắt nghỉ thay vì lặp từ.':'Bản chép có ít từ đệm phổ biến.']};
}
function speech(){
  const s=state.speech,hasRec=!!(window.SpeechRecognition||window.webkitSpeechRecognition),m=s.feedback;
  return `${head('SPEAK WITH PURPOSE','Giọng nói của bạn, <span class="serif">câu chuyện của bạn.</span>','Luyện nội dung và cấu trúc bài nói. Chuyển lời nói thành chữ khi trình duyệt cho phép, hoặc tự nhập bản chép.')}
  <div class="grid cols-2" style="align-items:start"><div class="panel"><div class="flex-between"><h3>01. Nội dung muốn trình bày</h3><span class="pill">${icon('mic')} Luyện nói</span></div><p class="panel-desc">Bạn có thể dán dàn ý để tự đối chiếu, không cần nộp cho AI ngay từ đầu.</p><div class="field"><label for="speech-reference">Dàn ý / nội dung chuẩn bị (không bắt buộc)</label><textarea class="textarea" id="speech-reference" placeholder="Mở đầu… / Ý 1… / Ví dụ… / Kết luận…">${e(s.reference)}</textarea></div><div class="field" style="margin-top:18px"><label for="speech-transcript">Bản chép phần bạn tự nói</label><textarea class="textarea tall" id="speech-transcript" placeholder="Nhấn mic để chuyển lời nói thành chữ, hoặc tự nhập những gì bạn đã nói…">${e(s.transcript)}</textarea></div><div class="button-row" style="margin-top:15px"><button class="btn ${s.recording?'btn-danger':'btn-primary'}" data-action="speech-record" ${hasRec?'':'disabled'}>${icon(s.recording?'pause':'mic')} ${s.recording?'Dừng ghi lời nói':'Bắt đầu ghi lời nói'}</button><button class="btn btn-light" data-action="speech-audio">${icon(recorder&&recorder.state==='recording'?'pause':'volume')} ${recorder&&recorder.state==='recording'?'Dừng thu âm':'Thu âm riêng'}</button></div><p class="field-hint" style="margin-top:12px">${hasRec?'Nhận dạng giọng nói phụ thuộc trình duyệt, kết nối mạng và quyền microphone.':'Trình duyệt này chưa hỗ trợ nhận dạng giọng nói; hãy nhập bản chép trực tiếp.'} Thu âm tùy chọn chỉ nằm trên thiết bị, không tải lên server.</p>${localAudioUrl?`<a class="btn btn-light btn-small" style="margin-top:10px" href="${localAudioUrl}" download="potato-luyen-noi.webm">${icon('download')} Lưu file thu âm về máy</a>`:''}</div>
  <div class="stack"><section class="card"><h3>02. Kết thúc lượt nói & nhận góp ý</h3><p class="muted tiny" style="margin:9px 0 18px">Chỉ đánh giá các dấu hiệu có thể quan sát từ văn bản, không tự nhận biết phát âm, biểu cảm hay độ tự tin.</p><button class="btn btn-primary btn-block" data-action="speech-analyze">Xem góp ý ngay ${icon('arrow')}</button>${s.recording?`<div class="flex-start" style="margin-top:15px"><span class="speech-wave">${Array.from({length:12},()=>'<i></i>').join('')}</span><strong>Đang nhận dạng lời nói…</strong></div>`:''}</section>
  <section class="card"><h3>Mỗi lượt luyện: nghe – nhìn lại – nói tốt hơn</h3><div class="separator" style="margin:12px 0"></div><div class="tip-list"><div class="tip"><span class="icon-tile">${icon('book')}</span><div><strong>Nội dung có lập luận?</strong><p>Bạn có đưa được lý do, ví dụ và giới hạn của quan điểm không?</p></div></div><div class="tip"><span class="icon-tile peach">${icon('message')}</span><div><strong>Người nghe có hiểu?</strong><p>Mở đầu dễ theo dõi, các ý nối tiếp và kết luận rõ ràng.</p></div></div><div class="tip"><span class="icon-tile gold">${icon('users')}</span><div><strong>Bạn có tương tác?</strong><p>Thử nhờ một người bạn nhận xét, thay vì chỉ tin số liệu tự động.</p></div></div></div></section></div></div>
  ${m?`<div class="section-title"><div><h2>Tổng kết buổi nói • Điều làm tốt & cần sửa</h2><p>Các chỉ số từ bản chép chỉ mang tính tham khảo.</p></div></div><section class="panel"><div class="grid cols-4" style="margin-bottom:20px"><div class="metric"><strong>${nf(m.words)}</strong><p>Từ đã nói / nhập</p></div><div class="metric"><strong>${m.wpm||'—'}</strong><p>Từ / phút ${m.wpm?'(ước tính)':''}</p></div><div class="metric"><strong>${nf(m.fillers)}</strong><p>Từ đệm phổ biến</p></div><div class="metric"><strong>${m.overlap===null?'—':Math.round(m.overlap*100)+'%'}</strong><p>Từ khóa trùng dàn ý*</p></div></div><div class="notice info">* Mức trùng từ khóa không thể hiện bài nói đúng ý hay hay dở. Giọng nói, ngữ điệu và biểu cảm chưa được hệ thống phân tích.</div><div class="point-card" style="margin-top:14px"><div class="flex-between"><strong>Chỉ số cấu trúc bản chép (tham khảo)</strong><strong>${m.structureScore}/100</strong></div><div class="progress-track" style="margin:10px 0"><div class="progress-fill" style="width:${m.structureScore}%"></div></div><p class="tiny muted">Quy tắc minh bạch: có mở đầu (20), phát triển ý (30), kết luận (20), độ dài bài (20), ít từ đệm (10). Đây <strong>không phải điểm chất lượng nội dung hay năng lực thuyết trình</strong>.</p></div><h3 style="margin:20px 0 12px">Nhận xét có thể kiểm chứng</h3><div class="stack" style="gap:10px">${m.tips.map(x=>`<div class="point-card">${icon('check')} &nbsp;${e(x)}</div>`).join('')}</div><div class="separator"></div><div class="button-row"><button class="btn btn-primary" data-action="speech-coach">${icon('spark')} ${s.coach?'Lấy gợi hỏi mới':'Nhận câu hỏi gợi mở'}</button><button class="btn btn-light" data-action="speech-save">${icon('book')} ${state.user.privacy.saveHistory?'Lưu buổi luyện':'Lưu đang tắt'}</button></div>${s.coach?`<div class="speech-coach-area"><span class="pill ${s.coach.mode==='ai'?'lime':'gold'}">${e(s.coach.label||'Gợi ý theo quy tắc')}</span><h3 style="margin:13px 0 8px">Nhận xét về nội dung</h3><p class="muted">${e(s.coach.opening||'')}</p><div class="review-card improve" style="margin-top:14px"><h4>Gợi ý cải thiện</h4><ul>${(s.coach.suggestions||[]).map(x=>`<li>${e(x)}</li>`).join('')}</ul></div><h4 style="margin:17px 0 10px">Câu hỏi giúp bạn luyện lại</h4><div class="prompt-list">${s.coach.questions.map((q,i)=>`<div class="prompt-question"><b>${i+1}</b>${e(q)}</div>`).join('')}</div><div class="notice ${s.coach.mode==='ai'?'info':'warn'}" style="margin-top:14px">${e(s.coach.notice)}</div></div>`:''}</section>`:''}`;
}
function recall(){
  const all=state.entries.filter(x=>x.type!=='speech');const due=all.filter(x=>!x.recall?.nextAt||new Date(x.recall.nextAt)<=new Date());
  const selected=all.find(x=>x.id===state.recallId);
  let content='';
  if(!selected)content=`<div class="flex-between" style="margin-bottom:17px"><h3>Những ý tưởng có thể ôn lại</h3><span class="pill">${due.length} đến hạn • ${all.length} tổng cộng</span></div>${all.length?`<div class="stack" style="gap:10px">${all.map(x=>`<div class="entry-card"><div class="icon-tile">${icon('book')}</div><div class="entry-main"><span class="pill ${due.some(y=>y.id===x.id)?'gold':''}">${due.some(y=>y.id===x.id)?'Đến lúc gợi nhớ':'Có thể luyện thêm'}</span><h3 class="entry-title">${e(x.topic)}</h3><p class="entry-preview">Lần gần nhất: ${x.recall?.history?.length?when(x.recall.history.at(-1).at):'Chưa ôn'} • ${x.recall?.history?.length||0} lần gợi nhớ</p></div><button class="btn btn-primary btn-small" data-action="recall-open" data-id="${x.id}">Thử nhớ lại ${icon('arrow')}</button></div>`).join('')}</div>`:empty('Chưa có điều gì để ôn lại','Hãy viết một bài tư duy đầu tiên. POTATO sẽ giúp bạn chủ động nhớ lại sau này.','thought','Bắt đầu bài tư duy')}`;
  else if(state.recallStage==='answer')content=`<div class="pill gold">${icon('lock')} KHÔNG MỞ LẠI BÀI CŨ TRƯỚC</div><h2 style="margin:18px 0 11px">${e(selected.topic)}</h2><p class="panel-desc">Hãy cố gắng nhớ lại bạn đã nghĩ gì, vì sao và bài học rút ra — không nhìn đáp án ngay. Quên một phần là bình thường.</p><div class="field"><label for="recall-answer">Từ trí nhớ của mình…</label><textarea id="recall-answer" class="textarea tall" placeholder="Quan điểm ban đầu của mình là… Sau đó mình học được…">${e(state.recallDraft)}</textarea></div><div class="button-row" style="margin-top:16px"><button class="btn btn-primary" data-action="recall-reveal">So sánh với bản đã viết ${icon('eye')}</button><button class="btn btn-light" data-action="recall-close">Quay lại</button></div>`;
  else content=`<h2 style="margin-bottom:13px">Bạn đã nhớ được <span class="serif">bao nhiêu?</span></h2><div class="result-compare"><div class="comparison-col"><h4>BẠN VỪA TỰ NHỚ</h4><p>${e(state.recallDraft)}</p></div><div class="comparison-col after"><h4>BẢN GHI TRƯỚC ĐÓ</h4><p>${e(selected.revised||selected.original)}</p></div></div><p style="margin:17px 0 12px">Tự đánh giá một cách thoải mái, không có điểm phạt:</p><div class="radio-pills">${[['1','Chưa nhớ rõ'],['2','Nhớ một phần'],['3','Nhớ khá tốt']].map(([v,t])=>`<button class="choice ${state.recallRating===Number(v)?'active':''}" data-action="recall-rate" data-id="${v}">${t}</button>`).join('')}</div><div class="button-row" style="margin-top:22px"><button class="btn btn-primary" data-action="recall-save">Lưu lượt gợi nhớ ${icon('check')}</button><button class="btn btn-light" data-action="recall-close">Hủy</button></div>`;
  return `${head('ACTIVE RECALL','Học thật là <span class="serif">nhớ lại được.</span>','Không đọc đi đọc lại một cách thụ động. Tự nhớ lại bằng lời của bạn, rồi mới đối chiếu và tự đánh giá.')}
  <div class="grid cols-2" style="margin-bottom:21px"><div class="mood-box"><strong>${icon('calendar')} Nhắc nhớ cách quãng</strong><p class="tiny muted" style="margin-top:7px">Sau mỗi lần ôn, hệ thống hẹn lần tiếp theo theo mức độ bạn tự đánh giá. Bạn vẫn có thể luyện lại sớm.</p></div><div class="mood-box"><strong>${icon('brain')} Không cạnh tranh trí nhớ</strong><p class="tiny muted" style="margin-top:7px">Mục tiêu không phải ghi nhớ nguyên văn, mà là nhắc lại được tư duy và trải nghiệm của chính mình.</p></div></div><section class="panel">${content}</section>`;
}
function memberList(room){return room.members.map((m,i)=>`<div class="participant"><span class="avatar">${e(m.nickname[0]||'?')}</span><div style="flex:1"><strong>${e(m.nickname)}</strong><div><small>${m.isHost?'Chủ phòng':m.team==='for'?'Phe ủng hộ':m.team==='against'?'Phe phản đối':'Thành viên'}${m.submitted?' · Đã chuẩn bị':''}${m.id===room.viewerId?' · Bạn':''}</small></div></div>${m.submitted?icon('check'):m.isHost?icon('trophy'):''}</div>`).join('');}
function debateTeams(room){
  const sides=[['for','ỦNG HỘ','AFFIRMATIVE'],['against','PHẢN ĐỐI','NEGATIVE']];
  return `<div class="debate-teams">${sides.map(([key,name,en])=>{
    const members=room.members.filter(m=>m.team===key);
    return `<div class="team-panel ${key}"><div class="team-top"><div><span class="eyebrow">${en}</span><h3>${name}</h3></div><span class="team-count">${members.length}/3</span></div><div class="team-members">${members.map((m,i)=>`<div class="team-member"><span class="avatar">${e(m.nickname[0]||'?')}</span><div><strong>${e(m.nickname)}</strong><small>Người ${i+1}${m.id===room.viewerId?' · Bạn':''}${m.submitted?' · Sẵn sàng':''}</small></div></div>`).join('')}${Array.from({length:Math.max(0,3-members.length)},(_,i)=>`<div class="team-empty">${icon('plus')} Đang chờ thành viên</div>`).join('')}</div></div>`;
  }).join('')}</div>`;
}
function roomVoiceToolbar(){const v=roomVoice.status;return `<div class="room-voice-bar"><div class="room-voice-icon">${icon('mic')}</div><div class="room-voice-copy"><div id="room-voice-status">${voiceStatusHtml()}</div><span id="room-voice-transcribing" class="tiny muted"></span></div><div class="button-row">${v.active?`<button class="btn btn-light btn-small" data-action="room-mute" ${v.locked?'disabled':''}>${v.locked?'Chờ lượt':v.muted?'Bật tiếng':'Tắt mic'}</button>`:`<button class="btn btn-light btn-small" data-action="room-enable-mic">${icon('mic')} Cho phép mic</button>`}<button class="btn btn-light btn-small" data-action="room-unlock-audio">${icon('volume')} Phát âm thanh</button></div></div>`;}
function rooms(){
  const r=state.room,mode=state.roomMode||'circle';let content='';
  if(!r){
    content=`<div class="room-mode-grid"><button class="room-mode-card ${mode==='circle'?'selected':''}" data-action="room-mode" data-id="circle"><span class="room-mode-icon">${icon('users')}</span><span class="mode-marker">${mode==='circle'?'Đang chọn':'Chọn chế độ'}</span><h2>Vòng tròn</h2><p>Cùng lắng nghe và góp ý, không chia phe.</p><span class="mode-foot">2–12 người ${icon('arrow')}</span></button>
      <button class="room-mode-card ${mode==='debate'?'selected':''}" data-action="room-mode" data-id="debate"><span class="room-mode-icon peach">${icon('trophy')}</span><span class="mode-marker">${mode==='debate'?'Đang chọn':'Chọn chế độ'}</span><h2>Debate 3v3</h2><p>3 ủng hộ · 3 phản đối · 6 lượt tranh luận.</p><span class="mode-foot">Đúng 6 người ${icon('arrow')}</span></button></div>
      <div class="room-entry-grid"><section class="room-entry-card"><span class="eyebrow">TẠO PHÒNG</span><h3>${mode==='debate'?'Mở một trận tranh biện':'Bắt đầu một cuộc trò chuyện'}</h3><form data-form="room-create" class="stack" style="gap:14px"><div class="field"><label>Chủ đề</label><input class="input" name="topic" required maxlength="280" minlength="5" placeholder="Ví dụ: AI làm chúng ta bớt tự suy nghĩ?" value="${e(state.roomCreateTopic||'AI giúp hay làm chúng ta lười suy nghĩ?')}"></div><button class="btn btn-primary" type="submit">${icon('plus')} Tạo phòng ${icon('arrow')}</button></form></section>
      <section class="room-entry-card"><span class="eyebrow">THAM GIA</span><h3>Có mã phòng rồi?</h3><form data-form="room-join" class="stack" style="gap:13px"><div class="field"><label>Mã phòng 6 ký tự</label><input name="code" class="input room-code-input" minlength="6" maxlength="6" placeholder="VD: M7P9QK" required></div>${mode==='debate'?`<div class="field"><label>Chọn phe (có thể đổi trong phòng)</label><select name="team" class="select"><option value="against" ${state.roomTeam==='against'?'selected':''}>Phe phản đối</option><option value="for" ${state.roomTeam==='for'?'selected':''}>Phe ủng hộ</option></select></div>`:''}<button type="submit" class="btn btn-light">Vào phòng ${icon('arrow')}</button></form></section></div>
      <p class="room-note">${icon('mic')} POTATO xin quyền micro ngay khi bạn tạo hoặc vào phòng. Khi bạn cấp quyền và kết nối thành công, người trong phòng có thể nghe bạn; bạn luôn có thể tắt mic.</p>
      ${state.roomList?.length?`<div class="section-title" style="margin-top:26px"><h2>Phòng đã tham gia</h2></div><div class="grid cols-3">${state.roomList.slice(0,6).map(x=>`<button class="card card-hover" data-action="room-reopen" data-id="${x.code}" style="text-align:left"><span class="pill">${x.mode==='debate'?'3v3':'Vòng tròn'} · ${x.count} người</span><h3 style="margin:10px 0">${e(x.topic)}</h3><span class="tiny muted">${e(x.code)}</span></button>`).join('')}</div>`:''}`;
  }else{
    const host=r.viewerId===r.hostId,me=r.members.find(m=>m.id===r.viewerId),debate=r.mode==='debate';
    const prepRemaining=Math.ceil(Math.max(0,(r.deadline||0)-Date.now())/1000);
    const turnRemaining=Math.ceil(Math.max(0,(r.turnDeadline||0)-Date.now())/1000);
    const canStart=debate?r.members.length===6&&r.teamCounts.for===3&&r.teamCounts.against===3:r.members.length>=2;
    const canReveal=debate?r.members.every(m=>m.submitted):r.members.filter(m=>m.submitted).length>=2;
    const round=Math.floor((r.turnNumber||0)/2);
    const roundTitles=['Mở đầu & lập trường','Lập luận & phản biện','Tổng kết & thông điệp'];
    const speaker=r.members.find(x=>x.id===r.activeSpeakerId);
    content=`<div class="room-banner potato-room-banner"><div><span class="room-type-badge">${debate?'DEBATE 3V3':'VÒNG TRÒN'} · ${r.stage==='lobby'?'ĐANG CHỜ':r.stage==='prep'?'CHUẨN BỊ':r.stage==='discussion'?'ĐANG DIỄN RA':'ĐÃ KẾT THÚC'}</span><div class="room-code">${e(r.code)}</div><p>${e(r.topic)}</p></div><div class="button-row"><button class="btn btn-lime" data-action="room-copy">${icon('share')} Sao chép mã</button><button class="btn btn-light" data-action="room-leave">Rời phòng</button></div></div>
      ${r.stage!=='ended'?roomVoiceToolbar():''}
      ${debate?debateTeams(r):`<div class="circle-member-strip">${r.members.map(m=>`<span class="mini-member ${m.id===r.activeSpeakerId?'speaking':''}"><b>${e(m.nickname[0]||'?')}</b>${e(m.nickname)}${m.submitted?' ✓':''}</span>`).join('')}</div>`}
      <section class="potato-room-workspace">`;
    if(r.stage==='lobby'){
      content+=`<div class="exercise-intro"><div><span class="eyebrow">01 · SẴN SÀNG</span><h2>${debate?'Đủ hai phe, bắt đầu.':'Mời bạn và bắt đầu.'}</h2><p>${debate?'Mỗi phe cần 3 người. Chủ phòng thuộc phe ủng hộ lúc tạo.':'Chỉ cần hai người là có thể thảo luận.'}</p></div><span class="pill">${r.members.length}/${debate?6:12} người</span></div>
      ${debate?`<div class="my-team-choice"><strong>Phe của bạn:</strong>${[['for','Ủng hộ'],['against','Phản đối']].map(([v,label])=>`<button class="choice ${me?.team===v?'active':''}" data-action="room-team" data-id="${v}">${label}</button>`).join('')}</div>`:''}
      ${host?`<div class="room-settings"><div class="field"><label>Chuẩn bị</label><select class="select" id="room-prep-time"><option value="15">15 giây · demo</option><option value="60">1 phút</option><option value="90" selected>90 giây</option><option value="180">3 phút</option></select></div>${debate?`<div class="field"><label>Thời gian mỗi lượt</label><select id="room-turn-time" class="select"><option value="45">45 giây</option><option value="75" selected>75 giây</option><option value="120">2 phút</option></select></div>`:''}<button class="btn btn-primary" data-action="room-start" ${canStart?'':'disabled'}>Bắt đầu ${icon('arrow')}</button></div>`:'<p class="room-wait-note">Đợi chủ phòng bắt đầu…</p>'}`;
    }else if(r.stage==='prep'){
      content+=`<div class="exercise-intro"><div><span class="eyebrow">02 · NGUYÊN BẢN TRƯỚC</span><h2>Chuẩn bị ý kiến riêng.</h2><p>Quan điểm chỉ được mở sau khi mọi người chuẩn bị xong.</p></div><div class="compact-timer" id="room-clock">${timeFmt(prepRemaining)}</div></div>
      ${me?.submitted?`<div class="notice">${icon('check')} Bạn đã nộp bài. Đợi các thành viên còn lại.</div><div class="point-card" style="margin-top:12px"><p>${e(r.positions?.[r.viewerId]?.text||'')}</p></div>`:`<form data-form="room-position" class="compact-room-form"><label for="room-position-text">Lập trường và lý do của bạn</label><textarea class="textarea tall" id="room-position-text" name="text" minlength="15" required placeholder="Mình cho rằng… bởi vì…">${e(state.roomDraft)}</textarea><div class="solo-actions"><button type="button" class="btn btn-light" data-action="voice-toggle" data-id="room-position-text">${icon('mic')} ${voiceTarget==='room-position-text'?'Dừng ghi':'Nói bằng mic'}</button><button type="submit" class="btn btn-primary">Nộp quan điểm ${icon('arrow')}</button></div></form>`}
      ${host?`<div class="room-host-action"><span>${r.members.filter(m=>m.submitted).length}/${r.members.length} người đã chuẩn bị</span><button class="btn btn-primary" data-action="room-reveal" ${canReveal&&(prepRemaining===0||r.members.every(m=>m.submitted))?'':'disabled'}>Bắt đầu tranh luận ${icon('arrow')}</button></div>`:''}`;
    }else if(r.stage==='discussion'){
      content+=`<div class="turn-focus"><span class="eyebrow">${debate?`LƯỢT ${r.turnNumber+1}/6 · ${roundTitles[round]||'Kết luận'}`:'TRÌNH BÀY THEO LƯỢT'}</span><div class="turn-person"><span class="turn-avatar">${e(speaker?.nickname?.[0]||'?')}</span><div><p>ĐANG ĐẾN LƯỢT</p><h2>${e(r.activeSpeakerName||'Thành viên')}</h2>${debate?`<span class="pill ${speaker?.team==='for'?'lime':'gold'}">Phe ${speaker?.team==='for'?'ủng hộ':'phản đối'}</span>`:''}</div></div>${debate?`<div class="turn-timer" id="room-turn-clock">${timeFmt(turnRemaining)}</div>`:''}${host?`<button class="btn btn-primary" data-action="room-next">${debate&&r.turnNumber>=5?'Kết thúc Debate':'Chuyển lượt'} ${icon('arrow')}</button>`:''}</div>
      <div class="room-talk-grid"><div class="room-talk-form"><h3>Góp tiếng nói</h3><p class="tiny muted">${r.activeSpeakerId===r.viewerId?'Bạn có thể trình bày luận điểm.':'Đang nghe: bạn có thể hỏi hoặc phản hồi.'}</p><form data-form="room-message" class="stack" style="gap:10px;margin-top:13px"><select class="select" name="kind">${r.activeSpeakerId===r.viewerId?'<option value="argument">Trình bày luận điểm</option>':'<option value="question">Đặt câu hỏi</option>'}<option value="reply">Phản hồi</option></select><textarea class="textarea" id="room-message-text" name="text" minlength="5" required placeholder="Nói hoặc viết ý kiến của bạn…">${e(state.roomDraftMessage||'')}</textarea><div class="solo-actions"><button class="btn btn-light" type="button" data-action="voice-toggle" data-id="room-message-text">${icon('mic')} ${voiceTarget==='room-message-text'?'Dừng ghi':'Ghi bằng mic'}</button><button class="btn btn-primary" type="submit">Gửi ${icon('send')}</button></div></form></div><div class="room-positions"><h3>Quan điểm ban đầu</h3><details><summary>Xem quan điểm của từng người</summary>${r.members.map(m=>r.positions?.[m.id]?`<div class="compact-position"><strong>${e(m.nickname)}</strong><p>${e(r.positions[m.id].text)}</p></div>`:'').join('')}</details></div></div>
      ${host?`<button class="text-button danger-button" data-action="room-end" style="margin-top:17px">Kết thúc phòng sớm</button>`:''}`;
    }else{
      const supporting=r.scores.filter(x=>x.team==='for').reduce((sum,x)=>sum+x.score,0);
      const opposing=r.scores.filter(x=>x.team==='against').reduce((sum,x)=>sum+x.score,0);
      content+=`<div class="success-hero"><div class="success-icon">${icon('check')}</div><h2>Cuộc trò chuyện đã hoàn thành.</h2><p>Những điểm ghi nhận là phản hồi của các thành viên, không phải phán quyết của AI.</p></div>${debate?`<div class="debate-result"><div><strong>${supporting}</strong><p>ỦNG HỘ</p></div><span>—</span><div><strong>${opposing}</strong><p>PHẢN ĐỐI</p></div></div>`:''}<div class="stack" style="gap:8px;margin-top:15px">${r.scores.map(x=>`<div class="score-row"><span>${e(x.nickname)}</span><strong style="margin-left:auto">${x.score} ghi nhận</strong></div>`).join('')}</div><button class="btn btn-primary" data-action="room-new" style="margin-top:18px">Tạo phòng mới ${icon('arrow')}</button>`;
    }
    content+='</section>';
    if(['discussion','ended'].includes(r.stage))content+=`<section class="room-feed"><div class="section-title"><div><h2>Trao đổi trong phòng</h2><p>Ghi lại các câu hỏi, lập luận và phản hồi.</p></div></div>${r.messages.length?`<div class="room-feed-items">${r.messages.map(m=>`<article class="msg-card"><div class="flex-between"><strong>${e(m.nickname)}</strong><span class="pill">${m.kind==='question'?'Câu hỏi':m.kind==='reply'?'Phản hồi':'Luận điểm'}</span></div><p>${e(m.text)}</p><div class="flex-between"><span class="tiny muted">${m.votes} lượt ghi nhận</span>${r.stage==='discussion'&&m.userId!==r.viewerId&&!m.voters.length?`<button class="btn btn-light btn-small" data-action="room-vote" data-id="${m.id}" data-tag="insight">${icon('check')} Ghi nhận</button>`:''}</div></article>`).join('')}</div>`:'<p class="muted tiny">Chưa có lượt trao đổi. Hãy bắt đầu bằng một câu hỏi.</p>'}</section>`;
  }
  return `<div class="streamlined-page room-page">${head('KẾT NỐI CÙNG NHAU','Nói để hiểu. <span class="serif">Nghe để gần.</span>','Chọn một hình thức, mời bạn bằng mã phòng.')}${content}</div>`;
}

function quests(){
  const categories=['Tất cả',...new Set(QUESTS.map(q=>q.category))];const filtered=state.questCategory==='Tất cả'?QUESTS:QUESTS.filter(x=>x.category===state.questCategory);
  const picked=QUESTS.find(x=>x.id===state.questSelected);
  if(picked)return `${head('REAL-WORLD QUEST','Một thử thách. <span class="serif">Một thay đổi thật.</span>','Tự trải nghiệm trước khi ghi lại bài học của bạn.',`<button class="btn btn-light btn-small" data-action="quest-close">${icon('back')} Tất cả thử thách</button>`)}<div class="grid cols-2" style="align-items:start"><section class="panel"><span class="pill lime">${e(picked.category)} • ${e(picked.duration)}</span><h2 style="margin:17px 0 10px">${e(picked.title)}</h2><p class="panel-desc">${e(picked.description)}</p><h3>Các bước gợi ý</h3><div class="quest-steps">${picked.steps.map((s,i)=>`<div class="quest-step"><span class="check-circle">${i+1}</span><span>${e(s)}</span></div>`).join('')}</div><div class="notice info">Không cần đăng ảnh, cung cấp vị trí hay chứng minh với AI. Bạn tự ghi lại trải nghiệm một cách trung thực.</div></section><section class="card"><div class="icon-tile peach">${icon('edit')}</div><h3 style="margin:14px 0 9px">Bạn đã thử chưa?</h3><p class="panel-desc">Sau khi thực hiện, ghi lại điều thực sự xảy ra — không cần phải thành công hoàn toàn.</p><form data-form="quest-complete" class="stack" style="gap:13px"><input type="hidden" name="questId" value="${e(picked.id)}"><div class="field"><label>Điều bạn làm và điều rút ra</label><textarea name="reflection" class="textarea tall" minlength="15" required placeholder="Mình đã thử… Điều bất ngờ nhất là… Lần sau mình sẽ…"></textarea></div><button type="submit" class="btn btn-primary">Ghi lại trải nghiệm ${icon('check')}</button></form><div class="separator"></div><strong class="tiny">Đã hoàn thành thử thách này ${state.questLogs.filter(x=>x.questId===picked.id).length} lần</strong><p class="tiny muted" style="margin-top:6px">Mỗi lần làm lại có thể mang đến một góc nhìn mới.</p></section></div>`;
  return `${head('REAL-WORLD QUEST','Tắt màn hình một lúc. <span class="serif">Bật cuộc sống lên.</span>','Mỗi nhiệm vụ gắn một kỹ năng tư duy với hành động nhỏ và an toàn ngoài đời thực.')}
  <div class="grid cols-3" style="margin-bottom:19px"><div class="stat-card"><div class="icon-tile green">${icon('flag')}</div><div><strong class="stat-num">${state.questLogs.length}</strong><p class="stat-name">Lần hoàn thành</p></div></div><div class="stat-card"><div class="icon-tile peach">${icon('target')}</div><div><strong class="stat-num">${new Set(state.questLogs.map(x=>x.questId)).size}</strong><p class="stat-name">Thử thách đã thử</p></div></div><div class="stat-card"><div class="icon-tile gold">${icon('heart')}</div><div><strong class="stat-num">${QUESTS.length}</strong><p class="stat-name">Ý tưởng để thực hành</p></div></div></div>
  <div class="category-tabs" style="margin:0 0 20px">${categories.map(c=>`<button class="choice ${state.questCategory===c?'active':''}" data-action="quest-filter" data-id="${e(c)}">${e(c)}</button>`).join('')}</div>
  <div class="grid cols-3">${filtered.map(q=>`<div class="quest-card"><div class="flex-between"><div class="icon-tile ${q.category==='Kết nối'?'peach':q.category==='Tập trung'?'gold':'green'}">${icon(q.icon)}</div>${state.questLogs.some(l=>l.questId===q.id)?`<span class="pill lime">${icon('check')} Đã thử</span>`:`<span class="pill outline">${e(q.duration)}</span>`}</div><h3>${e(q.title)}</h3><p>${e(q.description)}</p><button class="btn btn-light btn-small" data-action="quest-open" data-id="${q.id}">Xem thử thách ${icon('arrow')}</button></div>`).join('')}</div>`;
}
function journal(){
  const types=[['all','Tất cả'],['thought','Tự nghĩ'],['perspective','Đảo góc nhìn'],['speech','Luyện nói']];
  const selected=state.entries.find(x=>x.id===state.detailId);
  const entries=state.journalFilter==='all'?state.entries:state.entries.filter(x=>x.type===state.journalFilter);
  if(selected)return `${head('THOUGHT EVOLUTION','Mỗi phiên bản của bạn <span class="serif">đều đáng được lắng nghe.</span>','Nhìn lại quá trình hình thành, thử thách và điều chỉnh quan điểm.',`<button class="btn btn-light btn-small" data-action="journal-close">${icon('back')} Danh sách</button>`)}
  <section class="panel"><div class="flex-between"><div><span class="pill">${when(selected.createdAt)} • ${selected.type==='thought'?'Bài tư duy':selected.type==='perspective'?'Đảo góc nhìn':'Luyện nói'}</span><h2 style="margin:15px 0 11px">${e(selected.topic)}</h2></div></div><div class="result-compare"><div class="comparison-col"><h4>${selected.type==='perspective'?'LẬP TRƯỜNG BAN ĐẦU':'01 • SUY NGHĨ / BÀI NÓI GỐC'}</h4><p>${e(selected.original)}</p></div><div class="comparison-col after"><h4>${selected.type==='perspective'?'LÝ LẼ Ở PHÍA ĐỐI LẬP':selected.type==='speech'?'DÀN Ý ĐÃ CHUẨN BỊ':'02 • ĐIỀU CHỈNH SAU GỢI HỎI'}</h4><p>${e(selected.revised||'Không có phần bổ sung.')}</p></div></div>
  ${selected.lesson?`<div class="point-card" style="margin-top:15px"><strong>Bài học mình muốn giữ lại</strong><p style="white-space:pre-wrap;margin-top:7px">${e(selected.lesson)}</p></div>`:''}${selected.action?`<div class="notice" style="margin-top:12px">${icon('flag')} Hành động mình từng dự định: ${e(selected.action)}</div>`:''}
  ${selected.review?`<div class="section-title" style="margin-top:24px"><h2>Nhận xét đã lưu của buổi nói</h2></div>${renderThoughtReview(selected.review)}`:''}
  ${selected.questions?.length?`<h3 style="margin:23px 0 11px">Những câu hỏi mình đã gặp</h3><div class="prompt-list">${selected.questions.map((q,i)=>`<div class="prompt-question"><b>${i+1}</b>${e(q)}</div>`).join('')}</div>`:''}
  <div class="separator"></div><div class="flex-between"><span class="tiny muted">${selected.recall?.history?.length||0} lượt chủ động gợi nhớ</span><div class="button-row"><button class="btn btn-light btn-small" data-action="recall-open" data-id="${selected.id}">Ôn lại ${icon('repeat')}</button><button class="btn btn-danger btn-small" data-action="journal-delete" data-id="${selected.id}">Xóa bản ghi ${icon('trash')}</button></div></div></section>`;
  return `${head('THOUGHT EVOLUTION','Bản đồ trưởng thành <span class="serif">của riêng bạn.</span>','Không đánh giá con người bằng những nhãn cố định. Bạn có thể thay đổi suy nghĩ khi hiểu thêm điều mới.')}
  <section class="card" style="margin-bottom:21px;background:#f0f6e7;border-color:#dce9d3"><div class="flex-between"><div><span class="pill lime">GIÁ TRỊ TÔI TRÂN TRỌNG</span><h3 style="margin:12px 0 8px">${state.user.values?.length?'Điều mình muốn giữ vững':'Bản sắc không phải một hồ sơ do AI đặt tên.'}</h3><p class="tiny muted">${state.user.values?.length?'Những giá trị này do chính bạn tự xác định và có thể sửa bất cứ lúc nào.':'Hãy tự chọn những giá trị bạn coi trọng, thay vì để AI suy đoán tính cách.'}</p></div><button class="btn btn-light btn-small" data-go="settings">Tùy chỉnh ${icon('edit')}</button></div><div class="category-tabs">${(state.user.values||[]).map(v=>`<span class="value-tag">${e(v)}</span>`).join('')}</div></section>
  <div class="flex-between" style="margin-bottom:18px"><div class="category-tabs">${types.map(([id,label])=>`<button class="choice ${state.journalFilter===id?'active':''}" data-action="journal-filter" data-id="${id}">${label}</button>`).join('')}</div><span class="tiny muted">${entries.length} bản ghi</span></div>
  ${entries.length?`<div class="grid cols-2">${entries.map(x=>`<div class="entry-card"><div class="icon-tile ${x.type==='perspective'?'gold':x.type==='speech'?'peach':''}">${icon(x.type==='speech'?'mic':x.type==='perspective'?'layers':'brain')}</div><div class="entry-main"><span class="tiny muted">${when(x.createdAt)} • ${x.type==='thought'?'Tư duy nguyên bản':x.type==='perspective'?'Đổi góc nhìn':'Luyện thuyết trình'}</span><div class="entry-title">${e(x.topic)}</div><p class="entry-preview">${e(trunc(x.lesson||x.original,145))}</p><button class="btn btn-light btn-small" style="margin-top:12px" data-action="journal-detail" data-id="${x.id}">Nhìn lại ${icon('arrow')}</button></div></div>`).join('')}</div>`:empty('Chưa có dấu mốc nào','Hành trình tư duy bắt đầu từ một lần bạn dám tự nghĩ.','thought','Tự nghĩ lần đầu')}`;
}
function settings(){
  const vals=state.user.values||[];
  return `${head('MY DATA, MY VOICE','Dữ liệu của tôi. <span class="serif">Quyền quyết định của tôi.</span>','POTATO không tự suy đoán bản sắc của bạn. Bạn chọn điều muốn ghi nhớ và có thể xóa dữ liệu bất kỳ lúc nào.')}
  <div class="grid cols-2" style="align-items:start"><section class="panel"><div class="icon-tile green">${icon('users')}</div><h3 style="margin:15px 0 9px">Hồ sơ cá nhân</h3><form data-form="profile-save" class="stack" style="gap:14px"><div class="field"><label>Tên hiển thị</label><input class="input" name="nickname" required minlength="2" maxlength="35" value="${e(state.user.nickname)}"></div><div class="field"><label>Ba đến năm giá trị bạn trân trọng (cách nhau bằng dấu phẩy)</label><input class="input" name="values" maxlength="400" placeholder="Tò mò, Tử tế, Tự chủ" value="${e(vals.join(', '))}"><span class="field-hint">Không có AI gán tính cách. Chỉ bạn mới biết điều gì phù hợp.</span></div><button type="submit" class="btn btn-primary">Lưu thay đổi ${icon('check')}</button></form></section>
  <div class="stack"><section class="card"><div class="icon-tile">${icon('shield')}</div><h3 style="margin:14px 0 9px">Riêng tư và quyền kiểm soát</h3><p class="panel-desc">Nhật ký được lưu trên server này theo mã hồ sơ ngẫu nhiên. Trong bản demo, không cần nhập email hoặc số điện thoại.</p><label class="privacy-toggle"><input type="checkbox" id="privacy-save" ${state.user.privacy.saveHistory?'checked':''}><span><strong>Cho phép lưu lịch sử tư duy</strong><span class="tiny muted" style="display:block">Tắt để bài thực hành mới không được lưu vào nhật ký.</span></span></label><div class="separator"></div><button class="btn btn-light" data-action="settings-export">${icon('download')} Xuất dữ liệu của mình (JSON)</button></section>
  <section class="card"><div class="icon-tile gold">${icon('spark')}</div><h3 style="margin:14px 0 9px">Trạng thái người hướng dẫn</h3><p class="tiny muted">${state.config.aiConnected?'Đã cấu hình khóa API phía server, AI sẽ giúp đặt câu hỏi gợi mở. Khi API lỗi, POTATO chuyển về gợi hỏi theo quy tắc.':'Chưa kết nối API AI. POTATO dùng bộ câu hỏi Socrates theo mẫu và ghi rõ chế độ, không giả vờ là AI đang tự phân tích.'}</p><div class="notice" style="margin-top:14px">${icon('info')} Muốn bật AI thực: người phát triển điền GEMINI_API_KEY hoặc OPENAI_API_KEY trong file .env trên server. Không nhập khóa API vào trang web.</div></section></div></div>
  <section class="danger-zone" style="margin-top:20px"><div class="flex-between"><div><h3 style="color:#9f5146">Xóa toàn bộ dữ liệu</h3><p class="tiny muted" style="margin-top:6px;max-width:640px">Xóa hồ sơ, bản ghi, lượt ôn, thử thách và các đóng góp liên quan trong phòng. Thao tác không thể hoàn tác. Hãy xuất dữ liệu trước nếu cần.</p></div><button class="btn btn-danger" data-action="settings-delete">${icon('trash')} Xóa hồ sơ</button></div></section>`;
}
const GAME_META={
 truth:{name:'Truth or Dare',subtitle:'Thật lòng, thử thách tử tế',icon:'heart',description:'Cùng chia sẻ trải nghiệm và thực hiện thử thách vui, an toàn, không áp lực.'},
 spy:{name:'Ai là gián điệp',subtitle:'Quan sát và suy luận',icon:'eye',description:'Mỗi người nhận từ khóa bí mật. Ai có từ khác? Đặt câu hỏi để tìm ra.'},
 relay:{name:'Tam sao thất bản',subtitle:'Nhớ và truyền đạt chính xác',icon:'message',description:'Một thông điệp qua nhiều người sẽ biến đổi ra sao? Tự kiểm chứng kết quả.'},
 wolf:{name:'Ma sói mini',subtitle:'Chia vai và điều phối',icon:'layers',description:'Quản trò điều hành đêm – ngày, chia vai kín, bình chọn và xác định thắng thua.'}
};
function gameButton(id,label,style='btn-primary',extra=''){return `<button class="btn ${style}" data-action="${id}" ${extra}>${label}</button>`;}
function games(){
  const g=state.game;
  if(!g)return `${head('PLAY TOGETHER','Chơi để gần nhau. <span class="serif">Nghĩ để hiểu nhau.</span>','Các trò chơi nhiều người trên một thiết bị. Thiết kế để nói chuyện trực tiếp thay vì mỗi người chỉ nhìn màn hình.')}
  <div class="grid cols-2">${Object.entries(GAME_META).map(([id,v])=>`<div class="game-card"><div class="flex-between"><div class="icon-tile ${id==='truth'?'peach':id==='spy'?'gold':'green'}">${icon(v.icon)}</div><span class="pill outline">Chuyền máy để chơi</span></div><h3>${v.name}</h3><p>${v.description}</p><button class="btn btn-light btn-small" data-action="game-open" data-id="${id}">Chơi ngay ${icon('arrow')}</button></div>`).join('')}</div><section class="card" style="margin-top:21px;background:#f3f6eb"><strong>${icon('heart')} Chơi để kết nối, không làm ai khó xử</strong><p class="tiny muted" style="margin-top:7px">Mọi người có quyền bỏ qua thử thách không thoải mái. Không yêu cầu tiết lộ bí mật nhạy cảm, không khuyến khích hành vi nguy hiểm hay chụp ảnh người khác khi chưa được đồng ý.</p></section>`;
  const meta=GAME_META[g.type];let content='';
  if(g.stage==='setup'){
    content=`<div class="grid cols-2" style="align-items:start"><section class="panel"><h3>Chuẩn bị người chơi</h3><p class="panel-desc" style="margin-top:6px">Mỗi dòng hoặc dấu phẩy là một người. Tên được giữ trong phiên chơi trên trình duyệt.</p><form data-form="game-setup" class="stack"><div class="field"><label>Tên các thành viên</label><textarea name="players" class="textarea tall" placeholder="An, Bình, Chi, Dũng, Hà" required>${e(g.players?.join(', ')||'An, Bình, Chi, Dũng, Hà')}</textarea><span class="field-hint">${g.type==='truth'?'2–12':g.type==='relay'?'3–12':g.type==='spy'?'3–12':'5–12'} người.</span></div><button class="btn btn-primary" type="submit">Bắt đầu ${e(meta.name)} ${icon('arrow')}</button></form></section><section class="card"><div class="icon-tile peach">${icon(meta.icon)}</div><h3 style="margin:15px 0 9px">${e(meta.subtitle)}</h3><p class="panel-desc">${e(meta.description)}</p><div class="notice info">${g.type==='wolf'?'Cần một quản trò không tham gia chơi để điều hành đêm và tiết lộ thông tin vai.':g.type==='spy'?'Chuyền máy lần lượt, mỗi người chỉ được xem vai của mình.':g.type==='relay'?'Mỗi người cố ghi nhớ thông điệp và diễn đạt lại không nhìn nội dung gốc.':'Mọi người có thể bỏ qua câu hỏi hoặc thử thách không thoải mái.'}</div></section></div>`;
  }else if(g.type==='truth'){
    const player=g.players[g.turn%g.players.length];
    content=`<div class="game-stage"><span class="pill gold">LƯỢT ${g.turn+1}</span><h2 style="margin-top:19px">Đến lượt ${e(player)}!</h2><div class="radio-pills" style="justify-content:center;margin:17px 0"><button class="choice ${g.truthType==='truth'?'active':''}" data-action="game-truth-type" data-id="truth">Truth • Thật lòng</button><button class="choice ${g.truthType==='dare'?'active':''}" data-action="game-truth-type" data-id="dare">Dare • Thử thách</button></div><div class="game-secret" style="background:#fff;color:var(--green);border:1px solid #d7e6cd"><span class="eyebrow">${g.truthType==='truth'?'MỘT CÂU CHUYỆN THẬT':'MỘT THỬ THÁCH NHỎ'}</span><div class="game-word" style="font-size:28px;margin:16px 0;color:var(--green)">${e(g.card)}</div></div><div class="button-row" style="justify-content:center">${gameButton('game-truth-reroll',`${icon('refresh')} Đổi thẻ`,'btn-light')}${gameButton('game-truth-next',`Người tiếp theo ${icon('arrow')}`)}</div><p class="tiny muted" style="margin-top:16px">Bạn được quyền bỏ qua, không cần giải thích lý do.</p></div>`;
  }else if(g.type==='spy'){
    if(g.stage==='deal'){
      const player=g.players[g.index];content=`<div class="game-stage"><span class="pill lime">BÍ MẬT • ${g.index+1}/${g.players.length}</span><h2 style="margin-top:16px">Đến lượt <span class="serif">${e(player)}</span> nhận từ khóa.</h2><p class="tiny muted" style="margin:12px 0">Chỉ ${e(player)} nhìn màn hình. Nhấn xem rồi nhấn che trước khi chuyền máy.</p>${g.revealed?`<div class="game-secret"><span class="eyebrow">TỪ KHÓA CỦA BẠN</span><div class="game-word">${e(g.roles[g.index].word)}</div><p>${g.roles[g.index].spy?'Bạn là GIÁN ĐIỆP. Từ của bạn hơi khác!':'Bạn thuộc NHÓM THƯỜNG.'}</p></div>${gameButton('game-spy-next',`Che đi & chuyền máy ${icon('arrow')}`)}`:`<div class="game-secret" style="height:155px;display:grid;place-items:center">${icon('lock')} &nbsp; Từ khóa đang được che</div>${gameButton('game-spy-reveal',`${icon('eye')} Xem bí mật`)}`}</div>`;
    } else if(g.stage==='discuss'){
      content=`<div class="game-stage"><span class="pill gold">ĐÃ CHIA TỪ KHÓA</span><h2 style="margin:16px 0">Bây giờ, cùng <span class="serif">hỏi để suy luận.</span></h2><p class="muted" style="max-width:490px;margin:auto">Lần lượt mỗi người mô tả từ khóa của mình bằng một câu, không nói thẳng tên. Cả nhóm hỏi tiếp rồi chọn người đáng nghi nhất.</p><div class="button-row" style="justify-content:center;margin-top:26px">${gameButton('game-spy-vote',`Bình chọn gián điệp ${icon('arrow')}`)}</div></div>`;
    } else if(g.stage==='vote'){
      content=`<section class="panel" style="max-width:650px;margin:auto"><h2>Ai có từ khóa khác?</h2><p class="panel-desc" style="margin-top:12px">Sau khi đã thảo luận, cả nhóm cùng quyết định. Chọn người bị nghi ngờ và công bố kết quả.</p><form data-form="game-spy-result" class="stack"><div class="field"><label>Nhóm chọn ai?</label><select class="select" name="suspect">${g.players.map((p,i)=>`<option value="${i}">${e(p)}</option>`).join('')}</select></div><button class="btn btn-primary" type="submit">Mở kết quả ${icon('eye')}</button></form></section>`;
    }else{
      const spies=g.roles.map((r,i)=>r.spy?g.players[i]:null).filter(Boolean);const correct=g.roles[Number(g.suspect)]?.spy;
      content=`<div class="success-hero"><div class="success-icon">${icon('eye')}</div><h2>${correct?'Nhóm đã tìm đúng!':'Gián điệp đã thoát khỏi lần bình chọn.'}</h2><p>Gián điệp là <strong>${e(spies.join(', '))}</strong>. Từ khóa chung: <strong>${e(g.roles.find(x=>!x.spy).word)}</strong> • Từ của gián điệp: <strong>${e(g.roles.find(x=>x.spy).word)}</strong>.</p><p style="margin-top:10px">Hãy cùng nhìn lại cách đặt câu hỏi: lúc nào nhóm dựa trên bằng chứng, lúc nào chỉ dựa vào cảm giác?</p><div class="button-row" style="justify-content:center;margin-top:21px">${gameButton('game-restart',`Chơi lượt mới ${icon('refresh')}`)}${gameButton('game-exit',`Chọn trò khác`,'btn-light')}</div></div>`;
    }
  }else if(g.type==='relay'){
    if(g.stage==='read'){
      const player=g.players[g.index];const toRead=g.index===0?g.phrase:g.history.at(-1).text;
      content=`<div class="game-stage"><span class="pill gold">LƯỢT ${g.index+1}/${g.players.length}</span><h2 style="margin:18px 0">${e(player)}: hãy ghi nhớ.</h2><p class="tiny muted">Chỉ bạn nhìn câu này, cố ghi nhớ rồi nhấn che màn hình. Không quay lại xem.</p><div class="game-secret"><div class="game-word" style="font-size:26px">${e(toRead)}</div></div>${gameButton('game-relay-hide',`${icon('eyeoff')} Tôi đã ghi nhớ — che lại`)}</div>`;
    }else if(g.stage==='type'){
      const player=g.players[g.index];content=`<section class="panel" style="max-width:670px;margin:auto"><span class="pill lime">${g.index+1}/${g.players.length} • KHÔNG XEM LẠI</span><h2 style="margin:18px 0">${e(player)}, bạn nhớ gì?</h2><p class="panel-desc">Viết lại thông điệp bằng trí nhớ và cách diễn đạt của bạn. Người sau chỉ được xem bản bạn viết, không được xem câu gốc.</p><form data-form="game-relay-submit" class="stack"><div class="field"><label>Câu bạn nhớ được</label><textarea class="textarea tall" name="text" minlength="5" maxlength="500" required placeholder="Mình nhớ câu trước nói rằng…"></textarea></div><button class="btn btn-primary" type="submit">Gửi cho người tiếp theo ${icon('arrow')}</button></form></section>`;
    }else{
      content=`<section class="panel"><span class="pill lime">KẾT QUẢ TRUYỀN TIN</span><h2 style="margin:14px 0 10px">Một câu chuyện đã đi <span class="serif">bao xa?</span></h2><p class="panel-desc">So sánh từng phiên bản và chỉ ra nơi thông tin bị thêm, bớt, thay đổi. Đó là cách tin đồn có thể lan truyền.</p><div class="game-history"><span>0</span><div><strong>Câu gốc</strong><p>${e(g.phrase)}</p></div></div>${g.history.map((h,i)=>`<div class="game-history"><span>${i+1}</span><div><strong>${e(h.player)}</strong><p>${e(h.text)}</p></div></div>`).join('')}<div class="notice" style="margin-top:17px">Bài học: thông tin được truyền qua nhiều người không phải lúc nào cũng giữ nguyên. Khi điều gì quan trọng, hãy tìm về nguồn và kiểm chứng.</div><div class="button-row" style="margin-top:20px">${gameButton('game-restart',`Thử câu khác ${icon('refresh')}`)}${gameButton('game-exit','Chọn trò khác','btn-light')}</div></section>`;
    }
  }else if(g.type==='wolf'){
    if(g.stage==='deal'){
      const player=g.players[g.index],role=g.roles[g.index];
      content=`<div class="game-stage"><span class="pill gold">CHIA VAI • ${g.index+1}/${g.players.length}</span><h2 style="margin:14px 0">${e(player)}, vai của bạn là…</h2><p class="tiny muted">Chỉ người chơi hiện tại nhìn màn hình. Che vai trước khi chuyển điện thoại.</p>${g.revealed?`<div class="game-secret"><div class="game-word">${e(role)}</div><p>${role==='Sói'?'Bạn chọn nạn nhân vào ban đêm.':role==='Tiên tri'?'Mỗi đêm bạn được soi một người với sự hỗ trợ của quản trò.':role==='Bảo vệ'?'Mỗi đêm bạn được bảo vệ một người.':'Quan sát, suy luận và bỏ phiếu tìm Sói.'}</p></div>${gameButton('game-wolf-next',`Che lại & chuyền máy ${icon('arrow')}`)}`:`<div class="game-secret" style="height:150px;display:grid;place-items:center">${icon('lock')} &nbsp; Vai đang được che</div>${gameButton('game-wolf-reveal',`${icon('eye')} Xem vai`)}`}</div>`;
    }else if(g.stage==='night'){
      const alive=g.players.map((name,i)=>({name,i})).filter(x=>!g.eliminated.includes(x.i));
      const possibleVictims=alive.filter(x=>g.roles[x.i]!=='Sói');
      content=`<section class="panel"><span class="pill gold">ĐÊM ${g.round} • QUẢN TRÒ ĐIỀU HÀNH</span><h2 style="margin:14px 0">Mọi người nhắm mắt. <span class="serif">Đêm xuống rồi.</span></h2><p class="panel-desc">Quản trò đọc lần lượt: Sói thức dậy chọn một người → Sói ngủ → Bảo vệ chọn một người (nếu có) → Tiên tri soi một người (nếu có). Chỉ quản trò thao tác lựa chọn.</p><form class="stack" data-form="game-wolf-night"><div class="field"><label>Sói chọn ai?</label><select class="select" name="victim">${possibleVictims.map(p=>`<option value="${p.i}">${e(p.name)}</option>`).join('')}</select></div>${aliveHas(g,'Bảo vệ')?`<div class="field"><label>Người được bảo vệ</label><select class="select" name="protect"><option value="">Không bảo vệ</option>${alive.map(p=>`<option value="${p.i}">${e(p.name)}</option>`).join('')}</select></div>`:''}${aliveHas(g,'Tiên tri')?`<div class="field"><label>Tiên tri soi ai? (quản trò nói thầm kết quả)</label><select class="select" id="seer-check">${alive.map(p=>`<option value="${p.i}">${e(p.name)}</option>`).join('')}</select><button class="btn btn-light btn-small" type="button" data-action="game-wolf-seer">${icon('eye')} Xem kết quả tiên tri</button><span class="field-hint" id="seer-result">Quản trò chỉ tiết lộ cho Tiên tri.</span></div>`:''}<button class="btn btn-primary" type="submit">Trời sáng ${icon('arrow')}</button></form></section>`;
    }else if(g.stage==='day'){
      const alive=g.players.map((name,i)=>({name,i})).filter(x=>!g.eliminated.includes(x.i));
      content=`<section class="panel"><span class="pill lime">NGÀY ${g.round}</span><h2 style="margin:16px 0">${g.lastNight==='saved'?'Đêm qua không ai bị loại.':g.lastNight===null?'Bắt đầu ngày mới.':`${e(g.players[g.lastNight])} đã bị loại trong đêm.`}</h2><p class="panel-desc">Các thành viên còn lại thảo luận, đặt câu hỏi và bỏ phiếu chọn người bị nghi là Sói. Quản trò tổng hợp lựa chọn công khai trên một thiết bị.</p><div class="category-tabs">${alive.map(x=>`<span class="pill">${e(x.name)}</span>`).join('')}</div><form class="stack" data-form="game-wolf-vote"><div class="field"><label>Người nhận nhiều phiếu nhất</label><select class="select" name="suspect">${alive.map(x=>`<option value="${x.i}">${e(x.name)}</option>`).join('')}</select></div><button type="submit" class="btn btn-primary">Kết thúc bỏ phiếu ${icon('arrow')}</button></form><p class="tiny muted" style="margin-top:12px">Lưu ý: kết quả bỏ phiếu do nhóm quyết định bằng thảo luận; web không tự đoán Sói.</p></section>`;
    }else if(g.stage==='won'){
      content=`<div class="success-hero"><div class="success-icon">${icon('trophy')}</div><span class="pill gold">TRÒ CHƠI KẾT THÚC</span><h2 style="margin-top:14px">${e(g.winner)}</h2><p>${g.players.map((x,i)=>`${e(x)}: ${e(g.roles[i])}`).join(' • ')}</p><p style="margin-top:12px">Cả nhóm có thể cùng phân tích khoảnh khắc mình tin một lập luận và điều gì thực sự có bằng chứng.</p><div class="button-row" style="justify-content:center;margin-top:20px">${gameButton('game-restart','Chia vai mới','btn-primary')}${gameButton('game-exit','Chọn trò khác','btn-light')}</div></div>`;
    }
  }
  return `${head('PLAY TOGETHER',`${e(meta.name)} <span class="serif">cùng bạn bè.</span>`,e(meta.description),`<button class="btn btn-light btn-small" data-action="game-exit">${icon('back')} Trò chơi khác</button>`)}${content}`;
}
let confirmCallback=null;
function showConfirm(title,message,callback,danger=false){
  confirmCallback=callback;
  state.modal=`<div class="modal-overlay" data-action="modal-dismiss"><section class="modal" role="dialog" aria-modal="true" aria-label="${e(title)}"><header><h3>${e(title)}</h3><button class="modal-close" data-action="modal-close" aria-label="Đóng">${icon('close')}</button></header><p class="muted">${e(message)}</p><div class="button-row" style="margin-top:25px;justify-content:flex-end"><button class="btn btn-light" data-action="modal-close">Không, quay lại</button><button class="btn ${danger?'btn-danger':'btn-primary'}" data-action="modal-confirm">${danger?'Xác nhận xóa':'Xác nhận'} ${icon('arrow')}</button></div></section></div>`;
  render();
}
function closeModal(){state.modal=null;confirmCallback=null;render();}
async function loadRoomList(){try{const x=await request('/api/rooms');state.roomList=x.rooms;if(state.route==='rooms'&&!state.room)render();}catch(err){console.warn('Rooms list',err.message);}}
async function refreshRoom(code,draw=true){try{const result=await request(`/api/rooms/${encodeURIComponent(code)}`);state.room=result.room;if(roomVoice.active){if(state.room.stage==='ended')roomVoice.stop();else roomVoice.sync(state.room).catch(console.warn);}
    if(draw&&state.route==='rooms')render();return true;}catch(err){if(err.message.includes('chưa tham gia')||err.message.includes('Không tìm')){state.room=null;roomVoice.stop();state.roomEvents?.close();state.roomEvents=null;toast('Phòng đã đóng hoặc bạn không còn trong phòng.',true);render();}return false;}}
function subscribeRoom(code){
  if(state.roomEvents?.__code===code)return;
  if(state.roomEvents){state.roomEvents.close();state.roomEvents=null;}
  if(!state.token||!window.EventSource)return;
  const sse=new EventSource(`/api/rooms/${code}/events?token=${encodeURIComponent(state.token)}`);sse.__code=code;state.roomEvents=sse;
  sse.addEventListener('change',()=>{if(state.route==='rooms'&&state.room?.code===code)refreshRoom(code,true);});
  sse.onerror=()=>{ /* EventSource retries automatically; buttons also request fresh state. */ };
}
async function roomPost(action,body={}){
  if(!state.room)throw new Error('Chưa có phòng.');
  const data=await request(`/api/rooms/${state.room.code}/${action}`,body);
  if(data.room)state.room=data.room;
  if(state.room?.stage==='ended')roomVoice.stop();
  else if(roomVoice.active&&state.room)roomVoice.sync(state.room).catch(console.warn);
  render();return data;
}
function downloadJson(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function countSpeechDuration(){const s=state.speech;if(s.recordStart){s.seconds=Math.max(s.seconds,Math.round((Date.now()-s.recordStart)/1000));s.recordStart=0;}}
async function completeSpeech(){
 const s=state.speech;countSpeechDuration();
 if(s.transcript.trim().length<30){render();toast('Bài nói còn ngắn. Hãy nói thêm để được góp ý cụ thể.');return;}
 s.feedback=getSpeechMetrics(s.transcript,s.seconds,s.reference);
 render();toast('Đã kết thúc lượt nói. Đang chuẩn bị góp ý…');
 try {s.coach=await request('/api/coach',{topic:s.reference.slice(0,130)||'Bài trình bày cá nhân',response:s.transcript,mode:'speech'});if(state.route==='speech')render();}
 catch(err){toast('Không lấy được góp ý AI: '+err.message,true);}
}
async function onAction(action,el){
  const id=el.dataset.id||''; let t=state.thought; const p=state.perspective,f=state.focus,s=state.speech,g=state.game;
  switch(action){
    case 'sidebar-open':state.mobile=true;render();return;
    case 'sidebar-close':state.mobile=false;render();return;
    case 'modal-dismiss':closeModal();return;
    case 'modal-close':closeModal();return;
    case 'modal-confirm':{const cb=confirmCallback;state.modal=null;confirmCallback=null;if(cb)await cb();return;}
    case 'today-thought':resetThought();t=state.thought;t.topicId=id;go('thought');return;
    case 'think-filter':t.category=id;render();return;
    case 'think-select':t.topicId=id;render();return;
    case 'think-duration':t.duration=Number(id);render();return;
    case 'think-random':t.topicId=choose(t.category==='all'?TOPICS:TOPICS.filter(x=>x.category===t.category)).id;render();toast('Đã bốc một câu hỏi mới!');return;
    case 'think-speak-duration':t.speakDuration=Number(id);render();return;
    case 'think-show-all':t.showAll=!t.showAll;render();return;
    case 'think-start':{
      const custom=$('#think-custom-topic');if(custom)t.customTopic=custom.value.trim();
      if(t.topicId==='custom'&&t.customTopic.length<5)throw new Error('Hãy viết một câu hỏi riêng có ít nhất 5 ký tự.');
      const mic=await askMicrophonePermission();t.micReady=mic.ok;t.micNotice=mic.message;
      t.stage='prepare';t.original='';t.coach=null;t.deadline=Date.now()+t.duration*1000;render();return;
    }
    case 'think-back':t.stage='pick';stopTranscription();render();return;
    case 'think-back-write':t.stage='captured';stopTranscription();render();return;
    case 'think-finish-speak':finishThoughtSpeak();return;
    case 'think-speak-again':stopTranscription();t.original='';t.voiceRestarts=0;t.coach=null;t.stage='countdown';t.deadline=Date.now()+3000;render();return;
    case 'think-coach':{
      t.original=$('#think-original')?.value.trim()||t.original;
      if(t.original.length<20)throw new Error('Hãy nói hoặc nhập ít nhất 20 ký tự để POTATO góp ý.');
      await coachThoughtAfterSpeech(t);return;
    }
    case 'think-review-retry':if(t.stage!=='done')throw new Error('Hãy hoàn thành bài nói trước.');await fetchThoughtReview(t);return;
    case 'think-reset':resetThought();render();return;
    case 'perspective-stance':p.stance=id;render();return;
    case 'perspective-next':{
      p.original=$('#perspective-original')?.value.trim()||'';
      if(p.original.length<20)throw new Error('Hãy tự viết ít nhất 20 ký tự trước khi đổi vai.');p.step=1;render();return;
    }
    case 'perspective-back':p.step=0;render();return;
    case 'perspective-reset':state.perspective={step:0,dilemmaId:'d1',stance:'a',original:'',counter:'',lesson:'',savedId:null};render();return;
    case 'focus-duration':f.duration=Number(id);f.remaining=f.duration*60;render();return;
    case 'focus-start':{
      f.intention=$('#focus-intention')?.value.trim()||f.intention;
      if(!f.intention||f.intention.length<5)throw new Error('Hãy viết một việc cụ thể bạn muốn tập trung (tối thiểu 5 ký tự).');
      f.deadline=Date.now()+f.remaining*1000;f.running=true;render();return;
    }
    case 'focus-pause':f.remaining=Math.max(1,Math.ceil((f.deadline-Date.now())/1000));f.running=false;render();return;
    case 'focus-reset':f.running=false;f.remaining=f.duration*60;f.logged=false;render();return;
    case 'voice-toggle':{
      const target=id;
      if(!['think-original','think-revised','room-position-text','room-message-text'].includes(target))throw new Error('Vị trí nhận dạng không hợp lệ.');
      if(voiceTarget===target){stopTranscription();render();return;}
      startTranscription(target);render();return;
    }
    case 'speech-record':{
      const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SpeechRecognition)throw new Error('Trình duyệt không hỗ trợ nhận dạng giọng nói.');
      if(s.recording){recognition?.stop();s.recording=false;await completeSpeech();return;}
      const rec=new SpeechRecognition();recognition=rec;rec.lang='vi-VN';rec.continuous=true;rec.interimResults=true;
      const base=s.transcript.trim();s.recordStart=Date.now();s.recording=true;
      rec.onresult=ev=>{
        let text='';for(const result of Array.from(ev.results))text+=result[0].transcript+' ';
        s.transcript=[base,text.trim()].filter(Boolean).join(' ').trim();
        const area=$('#speech-transcript');if(area)area.value=s.transcript;
      };
      rec.onerror=ev=>{s.recording=false;countSpeechDuration();toast(ev.error==='not-allowed'?'Trình duyệt chưa cho phép dùng microphone.':'Không thể tiếp tục nhận dạng giọng nói.',true);render();};
      rec.onend=()=>{if(s.recording){s.recording=false;completeSpeech();}};
      try{rec.start();}catch{ s.recording=false;throw new Error('Không thể bắt đầu mic. Kiểm tra quyền microphone.'); }
      render();return;
    }
    case 'speech-audio':{
      if(recorder&&recorder.state==='recording'){recorder.stop();render();return;}
      if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Trình duyệt không hỗ trợ thu âm.');
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      audioChunks=[];
      recorder=new MediaRecorder(stream);
      recorder.ondataavailable=ev=>{if(ev.data.size)audioChunks.push(ev.data);};
      recorder.onstop=()=>{
        if(localAudioUrl)URL.revokeObjectURL(localAudioUrl);
        localAudioUrl=URL.createObjectURL(new Blob(audioChunks,{type:recorder.mimeType||'audio/webm'}));
        stream.getTracks().forEach(track=>track.stop());render();toast('Đã thu âm. Bạn có thể lưu file về máy.');
      };
      recorder.start();render();toast('Đang thu âm riêng trên thiết bị này.');return;
    }
    case 'speech-analyze':{
      s.transcript=$('#speech-transcript')?.value.trim()||s.transcript;
      s.reference=$('#speech-reference')?.value.trim()||s.reference;
      if(s.transcript.length<30)throw new Error('Cần bản chép tối thiểu 30 ký tự để phân tích.');
      s.feedback=getSpeechMetrics(s.transcript,s.recordStart?s.seconds+Math.floor((Date.now()-s.recordStart)/1000):s.seconds,s.reference);
      s.coach=null;render();toast('Đã phân tích các chỉ số từ văn bản. Đang chuẩn bị góp ý…');
      try{s.coach=await request('/api/coach',{topic:s.reference.slice(0,130)||'Bài trình bày cá nhân',response:s.transcript,mode:'speech'});if(state.route==='speech')render();}
      catch(err){toast('Chưa lấy được câu hỏi gợi mở: '+err.message,true);}
      return;
    }
    case 'speech-coach':{
      if(!s.feedback)throw new Error('Hãy phân tích bài nói trước.');
      s.coach=await request('/api/coach',{topic:s.reference.slice(0,130)||'Bài trình bày cá nhân',response:s.transcript,mode:'speech'});render();return;
    }
    case 'speech-save':{
      if(!s.feedback)throw new Error('Hãy phân tích bài nói trước.');
      if(s.lastSaved===s.transcript)throw new Error('Bài nói này đã được lưu. Hãy luyện lại hoặc chỉnh sửa để tạo bản mới.');
      if(!state.user.privacy.saveHistory)throw new Error('Bạn đang tắt lưu lịch sử. Bật trong Dữ liệu của tôi nếu muốn lưu bài luyện.');
      await request('/api/entries',{type:'speech',topic:trunc(s.reference||'Bài nói không có dàn ý',200),original:s.transcript,revised:s.reference,lesson:s.feedback.tips.join(' '),metrics:s.feedback});s.lastSaved=s.transcript;
      await refreshMe(false);render();toast('Đã lưu buổi luyện nói vào Hành trình tư duy.');return;
    }
    case 'recall-open':state.recallId=id;state.recallStage='answer';state.recallDraft='';state.recallRating=2;go('recall');return;
    case 'recall-close':state.recallId=null;state.recallStage='answer';render();return;
    case 'recall-reveal':state.recallDraft=$('#recall-answer')?.value.trim()||'';if(state.recallDraft.length<3)throw new Error('Hãy thử viết điều mình nhớ được trước khi đối chiếu.');state.recallStage='reveal';render();return;
    case 'recall-rate':state.recallRating=Number(id);render();return;
    case 'recall-save':{
      if(!state.recallId)throw new Error('Chưa chọn bản ghi.');
      await request(`/api/entries/${state.recallId}/recall`,{answer:state.recallDraft,rating:state.recallRating});
      state.recallId=null;state.recallStage='answer';await refreshMe();toast('Đã ghi nhận lần tự gợi nhớ. Hẹn gặp bạn ở lần ôn sau!');return;
    }
    case 'room-mode':state.roomMode=id==='debate'?'debate':'circle';render();return;
    case 'room-team':await roomPost('team',{team:id});return;
    case 'room-mute':roomVoice.toggleMute();render();return;
    case 'room-enable-mic':if(await roomVoice.requestPermission()){await roomVoice.enter(state.room);toast('Micro đã sẵn sàng để trò chuyện.');}render();return;
    case 'room-unlock-audio':roomVoice.unlockPlayback();return;
    case 'room-reopen':{await roomVoice.requestPermission();await refreshRoom(id,false);if(state.room){state.roomDraft='';subscribeRoom(id);await roomVoice.enter(state.room);render();}return;}
    case 'room-copy':{
      const code=state.room?.code;if(!code)return;
      if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(code);toast('Đã sao chép mã phòng.');}catch{window.prompt('Sao chép mã phòng này:',code);}}
      else window.prompt('Sao chép mã phòng này:',code);return;
    }
    case 'room-leave':{
      showConfirm('Rời phòng thảo luận','Bạn sẽ rời khỏi phòng này. Nếu đang là quản trò, quyền quản trò sẽ chuyển cho thành viên khác.',async()=>{
        await roomPost('leave');roomVoice.stop();state.roomEvents?.close();state.roomEvents=null;state.room=null;state.roomDraft='';await loadRoomList();render();toast('Bạn đã rời phòng.');
      });return;
    }
    case 'room-new':roomVoice.stop();state.room=null;state.roomEvents?.close();state.roomEvents=null;await loadRoomList();render();return;
    case 'room-start':await roomPost('start',{seconds:Number($('#room-prep-time')?.value)||90,turnSeconds:Number($('#room-turn-time')?.value)||75});return;
    case 'room-reveal':await roomPost('reveal');return;
    case 'room-next':await roomPost('next');return;
    case 'room-end':showConfirm('Kết thúc thảo luận','Bạn muốn chốt cuộc trò chuyện để hiện tổng kết các đóng góp?',async()=>{await roomPost('end');toast('Đã tổng kết phòng.');});return;
    case 'room-vote':await roomPost('vote',{messageId:id,tag:el.dataset.tag});return;
    case 'quest-filter':state.questCategory=id;render();return;
    case 'quest-open':state.questSelected=id;render();return;
    case 'quest-close':state.questSelected=null;render();return;
    case 'journal-filter':state.journalFilter=id;render();return;
    case 'journal-detail':state.detailId=id;go('journal');return;
    case 'journal-close':state.detailId=null;render();return;
    case 'journal-delete':showConfirm('Xóa bản ghi này?','Tất cả nội dung và lịch ôn của bản ghi này sẽ bị xóa vĩnh viễn.',async()=>{await request(`/api/entries/${id}`,null,'DELETE');state.detailId=null;await refreshMe();toast('Đã xóa bản ghi.');},true);return;
    case 'settings-export':{const data=await request('/api/export');downloadJson('potato-du-lieu-'+new Date().toISOString().slice(0,10)+'.json',data);toast('Đã xuất dữ liệu của bạn.');return;}
    case 'settings-delete':showConfirm('Xóa toàn bộ hồ sơ?','Hành động này xóa vĩnh viễn hồ sơ, bài tập, lịch ôn, thử thách và những đóng góp trong phòng thảo luận. Không thể khôi phục.',async()=>{await request('/api/me',null,'DELETE');localStorage.removeItem('potato_token');localStorage.removeItem('mach_token');state.token='';state.user=null;state.entries=[];state.room=null;state.roomEvents?.close();state.roomEvents=null;render();toast('Hồ sơ đã được xóa khỏi server này.');},true);return;
    case 'game-open':state.game={type:id,stage:'setup',players:['An','Bình','Chi','Dũng','Hà']};render();return;
    case 'game-exit':state.game=null;render();return;
    case 'game-restart':{const type=g.type,players=g.players;state.game={type,stage:'setup',players};render();return;}
    case 'game-truth-type':g.truthType=id;g.card=choose(id==='truth'?TRUTH_PROMPTS:DARE_PROMPTS);render();return;
    case 'game-truth-reroll':g.card=choose(g.truthType==='truth'?TRUTH_PROMPTS:DARE_PROMPTS);render();return;
    case 'game-truth-next':g.turn++;g.card=choose(g.truthType==='truth'?TRUTH_PROMPTS:DARE_PROMPTS);render();return;
    case 'game-spy-reveal':g.revealed=true;render();return;
    case 'game-spy-next':g.revealed=false;g.index++;if(g.index>=g.players.length)g.stage='discuss';render();return;
    case 'game-spy-vote':g.stage='vote';render();return;
    case 'game-relay-hide':g.stage='type';render();return;
    case 'game-wolf-reveal':g.revealed=true;render();return;
    case 'game-wolf-next':g.revealed=false;g.index++;if(g.index>=g.players.length){g.stage='night';g.round=1;}render();return;
    case 'game-wolf-seer':{
      const chosen=Number($('#seer-check')?.value);
      const role=g.roles[chosen];const dest=$('#seer-result');if(dest)dest.textContent=`${g.players[chosen]} ${role==='Sói'?'LÀ SÓI':'KHÔNG PHẢI SÓI'}. Chỉ nói thầm cho Tiên tri.`;return;
    }
    default:console.warn('Unknown UI action',action);return;
  }
}
function shuffle(input){const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function aliveHas(g,role){return g.roles.some((r,i)=>r===role&&!g.eliminated.includes(i));}
function wolfVictory(g){const alive=g.roles.map((r,i)=>({role:r,i})).filter(x=>!g.eliminated.includes(x.i));const wolves=alive.filter(x=>x.role==='Sói').length;
  if(wolves===0){g.winner='Dân làng chiến thắng!';g.stage='won';return true;}
  if(wolves>=alive.length-wolves){g.winner='Phe Sói chiến thắng!';g.stage='won';return true;}
  return false;
}
async function formSubmit(form){
  const type=form.dataset.form,b=new FormData(form),get=k=>String(b.get(k)||'').trim();
  switch(type){
    case 'onboarding':{
      const result=await request('/api/guest',{nickname:get('nickname')});state.token=result.token;localStorage.setItem('potato_token',state.token);
      await refreshMe(false);go('dashboard');toast('Chào mừng bạn đến với POTATO!');return;
    }
    case 'think-save':{
      stopTranscription();const t=state.thought;t.revised=get('revised');t.lesson=get('lesson');t.action=get('action');
      if(t.revised.length<20||t.lesson.length<10)throw new Error('Hãy viết bản nhìn lại ít nhất 20 ký tự và bài học ít nhất 10 ký tự.');
      if(state.user.privacy.saveHistory){const data=await request('/api/entries',{type:'thought',topic:thoughtTopic(),original:t.original,revised:t.revised,lesson:t.lesson,action:t.action,questions:t.coach?.questions||[]});t.savedId=data.entry.id;await refreshMe(false);}
      t.stage='done';t.review=null;t.reviewStatus='loading';render();toast(state.user.privacy.saveHistory?'Đã lưu bài và đang tổng hợp nhận xét.':'Bạn đã hoàn thành. Đang tổng hợp nhận xét, không lưu lịch sử.');
      await fetchThoughtReview(t);return;
    }
    case 'perspective-save':{
      const p=state.perspective;p.counter=get('counter');p.lesson=get('lesson');
      if(p.counter.length<20||p.lesson.length<15)throw new Error('Hãy viết lý lẽ đối lập và điều rút ra đủ cụ thể.');
      const d=DILEMMAS.find(x=>x.id===p.dilemmaId);
      if(state.user.privacy.saveHistory){const result=await request('/api/entries',{type:'perspective',topic:d.title,original:(p.stance==='a'?d.a:d.b)+'\n'+p.original,revised:(p.stance==='a'?d.b:d.a)+'\n'+p.counter,lesson:p.lesson});p.savedId=result.entry.id;await refreshMe(false);}
      p.step=2;render();toast('Bạn đã thử hai phía của một vấn đề.');return;
    }
    case 'room-create':{
      await roomVoice.requestPermission();
      const result=await request('/api/rooms',{topic:get('topic'),mode:state.roomMode});state.room=result.room;state.roomDraft='';subscribeRoom(state.room.code);await roomVoice.enter(state.room);render();toast('Đã tạo phòng. Hãy mời bạn bằng mã phòng!');return;
    }
    case 'room-join':{
      await roomVoice.requestPermission();
      const result=await request('/api/rooms/join',{code:get('code').toUpperCase(),team:get('team')||undefined});state.room=result.room;state.roomMode=state.room.mode;state.roomDraft='';subscribeRoom(state.room.code);await roomVoice.enter(state.room);render();toast('Bạn đã vào phòng thảo luận.');return;
    }
    case 'room-position':{
      stopTranscription();state.roomDraft=get('text');await roomPost('position',{text:state.roomDraft});toast('Đã nộp quan điểm của riêng bạn.');return;
    }
    case 'room-message':{
      stopTranscription();state.roomDraftMessage=get('text');await roomPost('messages',{text:state.roomDraftMessage,kind:get('kind')});state.roomDraftMessage='';render();return;
    }
    case 'quest-complete':{
      await request('/api/quest-logs',{questId:get('questId'),reflection:get('reflection')});await refreshMe(false);state.questSelected=null;render();toast('Đã ghi lại trải nghiệm ngoài đời thực.');return;
    }
    case 'profile-save':{
      const values=get('values').split(',').map(x=>x.trim()).filter(Boolean).slice(0,5);const result=await request('/api/me',{nickname:get('nickname'),values},'PATCH');state.user=result.user;render();toast('Đã lưu hồ sơ bạn tự xác định.');return;
    }
    case 'game-setup':{
      const g=state.game;
      const players=get('players').split(/[,\n;]+/).map(x=>x.trim().slice(0,25)).filter(Boolean);
      const min=g.type==='truth'?2:g.type==='relay'||g.type==='spy'?3:5;
      if(players.length<min||players.length>12)throw new Error(`Cần ${min}–12 người chơi.`);
      if(new Set(players.map(x=>x.toLocaleLowerCase('vi'))).size!==players.length)throw new Error('Tên các người chơi phải khác nhau.');
      g.players=players;
      if(g.type==='truth'){
        g.stage='play';g.turn=0;g.truthType='truth';g.card=choose(TRUTH_PROMPTS);
      }else if(g.type==='spy'){
        const pair=choose(SPY_PAIRS),spy=Math.floor(Math.random()*players.length);
        g.roles=players.map((_,i)=>({spy:i===spy,word:pair[i===spy?1:0]}));g.stage='deal';g.index=0;g.revealed=false;
      }else if(g.type==='relay'){
        g.phrase=choose(RELAY_PHRASES);g.history=[];g.index=0;g.stage='read';
      }else if(g.type==='wolf'){
        g.roles=shuffle(['Sói',...(players.length>=8?['Sói']:[]),'Tiên tri',...(players.length>=7?['Bảo vệ']:[]),...Array(players.length-(players.length>=8?2:1)-1-(players.length>=7?1:0)).fill('Dân làng')]);
        g.index=0;g.revealed=false;g.eliminated=[];g.round=1;g.lastNight=null;g.stage='deal';
      }
      render();return;
    }
    case 'game-spy-result':{
      const g=state.game;g.suspect=Number(get('suspect'));g.stage='result';render();return;
    }
    case 'game-relay-submit':{
      const g=state.game,text=get('text');if(text.length<5)throw new Error('Hãy viết lại ít nhất 5 ký tự bạn nhớ.');
      g.history.push({player:g.players[g.index],text});g.index++;g.stage=g.index>=g.players.length?'result':'read';render();return;
    }
    case 'game-wolf-night':{
      const g=state.game,victim=Number(get('victim')),protectedIndex=get('protect')!==''?Number(get('protect')):-1;
      if(g.eliminated.includes(victim))throw new Error('Không thể chọn người đã bị loại.');
      if(protectedIndex===victim)g.lastNight='saved';else{g.eliminated.push(victim);g.lastNight=victim;}
      if(!wolfVictory(g))g.stage='day';render();return;
    }
    case 'game-wolf-vote':{
      const g=state.game,suspect=Number(get('suspect'));
      if(g.eliminated.includes(suspect))throw new Error('Người chơi đã bị loại.');
      g.eliminated.push(suspect);g.lastVoted=suspect;
      if(!wolfVictory(g)){g.round++;g.lastNight=null;g.stage='night';}
      render();toast(`${g.players[suspect]} đã bị loại qua bình chọn.`);return;
    }
    default:console.warn('Unknown form',type);return;
  }
}
async function finishFocus(){
  const f=state.focus;if(!f.running||f.logged)return;
  f.running=false;f.remaining=0;f.logged=true;
  try{await request('/api/focus',{minutes:f.duration,intention:f.intention});await refreshMe(false);toast(`Bạn đã hoàn thành ${f.duration} phút tập trung. Giỏi vì đã giữ lời hứa với chính mình!`);}
  catch(err){toast(`Không thể lưu buổi tập trung: ${err.message}`,true);}
  render();
}
function tick(){
  const t=state.thought;
  if(t.stage==='prepare'){
    const remain=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    if(remain===0){t.stage='countdown';t.deadline=Date.now()+3000;render();}
    else{const node=$('#think-clock');if(node)node.textContent=timeFmt(remain);const progress=$('#think-progress');if(progress)progress.style.width=`${Math.max(0,100*(1-remain/t.duration))}%`;}
  }else if(t.stage==='countdown'){
    const remain=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    if(remain===0)beginThoughtSpeech();else{const node=$('#think-countdown');if(node)node.textContent=String(remain);}
  }else if(t.stage==='speak'){
    const remain=Math.ceil(Math.max(0,t.deadline-Date.now())/1000);
    if(remain===0)finishThoughtSpeak();else{const node=$('#think-speak-clock');if(node)node.textContent=timeFmt(remain);const progress=$('#think-speak-progress');if(progress)progress.style.width=`${Math.max(0,100*(1-remain/t.speakDuration))}%`;}
  }
  const f=state.focus;
  if(f.running){const remain=Math.ceil(Math.max(0,f.deadline-Date.now())/1000);
    if(remain<=0){finishFocus();}
    else{const node=$('#focus-clock');if(node)node.textContent=timeFmt(remain);
      const bar=$('#focus-progress');if(bar)bar.style.width=`${Math.min(100,100*(1-remain/(f.duration*60)))}%`;
    }
  }
  if(state.room?.stage==='prep'&&state.route==='rooms'){
    const remain=Math.ceil(Math.max(0,(state.room.deadline||0)-Date.now())/1000);
    const node=$('#room-clock');if(node)node.textContent=timeFmt(remain);
    if(remain===0){const btn=$('[data-action=room-reveal]');if(btn&&state.room.members.every(m=>m.submitted))btn.disabled=false;}
  }
  if(state.room?.mode==='debate'&&state.room.stage==='discussion'&&state.route==='rooms'){
    const remain=Math.ceil(Math.max(0,(state.room.turnDeadline||0)-Date.now())/1000);
    const node=$('#room-turn-clock');if(node)node.textContent=timeFmt(remain);
  }
}
function onInput(el){
  const id=el.id;
  if(id==='think-original'){
    state.thought.original=el.value;
    const hint=$('#think-write-hint');if(hint)hint.textContent=`${el.value.length} ký tự • ${el.value.length<20?'Cần ít nhất 20 ký tự':'Đủ nội dung nguyên bản'}`;
    const btn=$('#think-coach-btn');if(btn)btn.disabled=!!state.thought.coachLoading||el.value.trim().length<20;
  }
  if(id==='think-revised')state.thought.revised=el.value;
  if(id==='think-custom-topic')state.thought.customTopic=el.value;
  if(id==='perspective-original')state.perspective.original=el.value;
  if(id==='focus-intention')state.focus.intention=el.value;
  if(id==='speech-reference'){state.speech.reference=el.value;state.speech.feedback=null;}
  if(id==='speech-transcript'){state.speech.transcript=el.value;state.speech.feedback=null;}
  if(id==='recall-answer')state.recallDraft=el.value;
  if(el.name==='text'&&el.closest('form')?.dataset.form==='room-position')state.roomDraft=el.value;
  if(el.name==='text'&&el.closest('form')?.dataset.form==='room-message')state.roomDraftMessage=el.value;
}

document.addEventListener('click',async ev=>{
  const nav=ev.target.closest('[data-go]');
  if(nav){ev.preventDefault();go(nav.dataset.go);return;}
  const el=ev.target.closest('[data-action]');if(!el)return;
  if(el.dataset.action==='modal-dismiss'&&el!==ev.target)return;
  ev.preventDefault();
  if(el.dataset.running==='1')return;
  el.dataset.running='1';
  try{await onAction(el.dataset.action,el);}catch(err){console.error('Action error',err);toast(err.message||'Đã có lỗi xảy ra.',true);}finally{delete el.dataset.running;}
});
document.addEventListener('submit',async ev=>{
  const form=ev.target.closest('form[data-form]');if(!form)return;
  ev.preventDefault();if(form.dataset.running==='1')return;
  form.dataset.running='1';const btn=form.querySelector('[type=submit]');if(btn)btn.disabled=true;
  try{await formSubmit(form);}catch(err){console.error('Form error',err);toast(err.message||'Không thể hoàn tất thao tác.',true);}finally{delete form.dataset.running;if(btn&&btn.isConnected)btn.disabled=false;}
});
document.addEventListener('input',ev=>onInput(ev.target));
document.addEventListener('change',async ev=>{
  const el=ev.target;
  if(el.id==='perspective-topic'){state.perspective.dilemmaId=el.value;state.perspective.original='';render();}
  if(el.id==='privacy-save'){
    try{const result=await request('/api/me',{saveHistory:el.checked},'PATCH');state.user=result.user;toast(el.checked?'Đã bật lưu lịch sử.':'Đã tắt lưu các bài tập mới.');}
    catch(err){el.checked=!el.checked;toast(err.message,true);}
  }
});
window.addEventListener('hashchange',()=>{navigatePage();if(state.route==='rooms'&&!state.room)loadRoomList();});
window.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&state.modal)closeModal();});
setInterval(tick,250);
async function boot(){
  try{state.config=await request('/api/config');}catch{state.config={aiConnected:false};}
  if(state.token){try{await refreshMe(false);localStorage.setItem('potato_token',state.token);}catch{state.token='';localStorage.removeItem('potato_token');localStorage.removeItem('mach_token');}}
  state.route=routeFromHash();render();
  if(state.route==='rooms')loadRoomList();
}
boot();
