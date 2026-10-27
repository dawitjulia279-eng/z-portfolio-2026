'use strict';
const data=(window.PORTFOLIO || []).filter(item=>item.id!=='04-003');
const sections=[
 {id:'films',category:'产品视频',title:'产品视频',desc:'以动态画面呈现家具的形态、细节与生活场景。'},
 {id:'renders',category:'3dmax渲染',title:'3dmax 渲染',desc:'从整体空间到局部细节，展示不同办公家具的材质、结构与功能。'},
 {id:'skills',category:'skill个人家具制作模板',title:'Skill 个人家具制作模板',desc:'围绕同一款家具，组织白底图、场景图、人物使用图与网站首屏，形成完整的产品视觉系列。'},
 {id:'campaigns',category:'广告素材',title:'广告素材',desc:'结合产品卖点、信息层级与版面设计，呈现家具产品的广告视觉。'},
 {id:'ai',category:'AI网站素材图',title:'AI 网站素材图',desc:'面向网站展示的产品场景创作，探索家具与空间、光线及氛围的关系。'}
];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const adNames=['办公椅 · 舒适卖点','办公椅 · 工作与休憩','办公家具 · 产品合集','接待台 · 新客优惠','接待台 · 产品选型','吧台桌 · 产品与功能','接待台 · 促销专题'];
const aiNames=['接待台 · 零售空间','接待台 · 柔光场景','休闲沙发 · 居家一角','储物柜 · 客厅空间','办公桌 · 深色木质空间','接待台 · 酒店大堂','接待台 · 开阔空间','接待台 · 大理石与自然光','接待台 · 明亮商业空间'];
function label(item){
 if(item.category==='广告素材')return adNames[Number(item.name)-1]||item.name;
 if(item.category==='AI网站素材图')return aiNames[Number(item.name)-1]||item.name;
 if(item.category==='产品视频')return item.name.replace(/视频$/,'');
 if(item.category==='skill个人家具制作模板')return item.name.replace(/^首屏/,'网站首屏').replace(/^白底$/,'产品白底图');
 return item.name.replace(/^[A-Z]+-GK\d+-\d+\s*/,'').replace(/拷贝\s*(\d*)/,(_,n)=>n?`产品视角 ${n}`:'产品视角')||'整体场景';
}
function media(item){
 const name=label(item),title=escapeHTML(name),alt=escapeHTML(item.group+' · '+name);
 const cls=item.width/item.height>1.35?' landscape':'';
 if(item.type==='video')return `<figure class="work" data-asset="${item.id}"><div class="video-wrap"><video controls playsinline preload="none" poster="${item.poster}" width="${item.width}" height="${item.height}" aria-label="${alt}"><source src="${item.src}" type="video/mp4">浏览器不支持视频播放，请<a href="${item.src}">打开视频文件</a>。</video></div><figcaption><span>${title}</span><span>VIDEO</span></figcaption></figure>`;
 return `<figure class="work${cls}${item.width/item.height>2?' wide':''}" data-asset="${item.id}"><button class="image-open" data-image="${item.id}" aria-label="放大查看：${alt}"><img src="${item.thumb}" srcset="${item.thumb} 800w, ${item.src} 1920w" sizes="(max-width:767px) 50vw, (max-width:1100px) 45vw, 650px" width="${item.width}" height="${item.height}" alt="${alt}" loading="lazy" decoding="async"></button><figcaption><span>${title}</span><span>查看大图 ↗</span></figcaption></figure>`;
}
function counts(items){const images=items.filter(x=>x.type==='image').length,videos=items.filter(x=>x.type==='video').length;return [images?`${images} 张图片`:'',videos?`${videos} 段视频`:''].filter(Boolean).join(' · ')}
// Each row is intentionally composed: product overview, related views, then detail.
// Rows share image height through proportional columns, without cropping images.
const compositions={
 '会议桌1':[['02-002'],['02-005','02-004','02-008'],['02-003','02-006','02-007']],
 '会议桌2':[['02-011','02-012'],['02-015','02-016'],['02-013','02-014']],
 '升降办公桌':[['02-020','02-024'],['02-021','02-025'],['02-022','02-023']],
 '培训桌':[['02-029','02-034'],['02-030','02-033'],['02-031','02-032']],
 '屏风卡座':[['02-040'],['02-042','02-041','02-043'],['02-037','02-038','02-039']],
 '老板桌':[['02-053'],['02-049','02-047','02-052'],['02-048','02-050','02-051']],
 '办公桌':[['03-004','03-005'],['03-002','03-003'],['03-006','03-007']],
 '单人沙发':[['03-011','03-009','03-010'],['03-012','03-013']],
 '吧椅':[['03-017','03-015','03-016'],['03-018']],
 '户外餐桌和餐椅组合':[['03-024','03-022','03-020'],['03-023','03-021']],
 '接待台':[['03-029','03-027'],['03-026','03-028']]
};
function rowsMarkup(rows,items){
 const lookup=new Map(items.map(item=>[item.id,item]));
 const used=new Set();
 const markup=rows.map(ids=>{
  const row=ids.map(id=>lookup.get(id)).filter(Boolean);
  row.forEach(item=>used.add(item.id));
  if(!row.length)return '';
  const kind=row.length===1?(row[0].width/row[0].height<.8?' poster-row':row[0].width/row[0].height<1.3?' feature-row':' banner-row'):'';
  return `<div class="composed-row${kind}" style="--columns:${row.map(item=>(item.width/item.height).toFixed(5)+'fr').join(' ')}">${row.map(media).join('')}</div>`;
 }).join('');
 // Keep future additions visible, even before a bespoke composition is assigned.
 const extra=items.filter(item=>!used.has(item.id));
 return markup+(extra.length?`<div class="composed-row" style="--columns:repeat(${Math.min(extra.length,3)},minmax(0,1fr))">${extra.map(media).join('')}</div>`:'');
}
function collectionImages(id,items){
 if(id==='campaigns')return `<div class="editorial-set"><h3 class="set-title">产品广告</h3>${rowsMarkup([['04-001','04-002','04-006'],['04-004','04-005','04-007']],items)}</div>`;
 return `<div class="editorial-set"><h3 class="set-title">接待空间</h3>${rowsMarkup([['05-001','05-002'],['05-008','05-009'],['05-006'],['05-007']],items.filter(x=>['05-001','05-002','05-006','05-007','05-008','05-009'].includes(x.id)))}</div><div class="editorial-set"><h3 class="set-title">居家与办公空间</h3>${rowsMarkup([['05-003','05-004'],['05-005']],items.filter(x=>['05-003','05-004','05-005'].includes(x.id)))}</div>`;
}
function groupMarkup(items,category){
 const groups=[...new Set(items.map(x=>x.group))];
 return groups.map((group,i)=>{
  const groupItems=items.filter(x=>x.group===group),imgs=groupItems.filter(x=>x.type==='image'),vids=groupItems.filter(x=>x.type==='video');
  return `<article class="group"><div class="group-heading"><h3>${escapeHTML(group)}</h3><p>${counts(groupItems)}</p></div><div class="composed-gallery">${rowsMarkup(compositions[group]||[imgs.map(x=>x.id)],imgs)}</div>${vids.length?`<div class="detail-videos${vids.length===1?' single-video':''}">${vids.map(media).join('')}</div>`:''}${i<groups.length-1?'<div class="group-divider"></div>':''}</article>`;
 }).join('');
}
document.querySelector('#collections').innerHTML=sections.map(s=>{
 const items=data.filter(x=>x.category===s.category);
 const grouped=s.id==='renders'||s.id==='skills';
 const cls=s.id==='films'?'film-gallery':s.id==='campaigns'?'ad-gallery':'gallery ai-gallery';
 return `<section id="${s.id}" class="collection" aria-labelledby="${s.id}-title"><h2 class="section-title" id="${s.id}-title">${s.title}</h2><p class="section-desc">${s.desc}</p><p class="section-meta">${counts(items)}${grouped?' · '+new Set(items.map(x=>x.group)).size+' 组作品':''}</p>${grouped?groupMarkup(items,s.category):s.id==='films'?`<div class="${cls}">${items.map(media).join('')}</div>`:collectionImages(s.id,items)}</section>`;
}).join('');
const viewer=document.querySelector('#viewer'),viewerImage=document.querySelector('#viewer-image');
let imageList=[],imageIndex=0,opener;
function showImage(){const item=imageList[imageIndex];viewerImage.src=item.src;viewerImage.alt=item.group+' · '+label(item);document.querySelector('#viewer-label').textContent=item.category+' / '+item.group+' / '+label(item);document.querySelector('#viewer-count').textContent=`${imageIndex+1} / ${imageList.length}`;}
document.addEventListener('click',event=>{const button=event.target.closest('[data-image]');if(!button)return;const item=data.find(x=>x.id===button.dataset.image);imageList=[...button.closest('.group,.collection').querySelectorAll('[data-image]')].map(el=>data.find(x=>x.id===el.dataset.image));imageIndex=imageList.findIndex(x=>x.id===item.id);opener=button;showImage();viewer.showModal();document.body.classList.add('viewing');document.querySelector('#close').focus();});
document.querySelector('#close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.classList.remove('viewing');viewerImage.removeAttribute('src');opener?.focus({preventScroll:true})});
function step(amount){imageIndex=(imageIndex+amount+imageList.length)%imageList.length;showImage()}
document.querySelector('#previous').addEventListener('click',()=>step(-1));document.querySelector('#next').addEventListener('click',()=>step(1));
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
document.querySelectorAll('video').forEach(v=>{v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()}));v.addEventListener('error',()=>{if(v.parentElement.querySelector('.media-error'))return;const p=document.createElement('p');p.className='media-error';p.textContent='视频暂时无法加载。';const a=document.createElement('a');a.href=v.querySelector('source').src;a.textContent='打开视频文件 ↗';p.append(' ',a);v.after(p)})});
document.querySelectorAll('.image-open img').forEach(img=>img.addEventListener('error',()=>{const button=img.closest('button');if(button.querySelector('.media-error'))return;const p=document.createElement('p');p.className='media-error';p.textContent='图片暂时无法加载，点击重试查看大图。';button.append(p)}));
const navLinks=[...document.querySelectorAll('nav a')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+entry.target.id)))}})},{rootMargin:'-15% 0px -65% 0px'});
document.querySelectorAll('.collection').forEach(s=>observer.observe(s));
const themeButton=document.querySelector('.theme');let theme;
try{theme=localStorage.getItem('portfolio-theme')}catch{}
theme=theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
function applyTheme(){document.documentElement.dataset.theme=theme;themeButton.textContent=theme==='dark'?'浅色':'深色';themeButton.setAttribute('aria-label',theme==='dark'?'切换浅色外观':'切换深色外观')}
applyTheme();themeButton.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';applyTheme();try{localStorage.setItem('portfolio-theme',theme)}catch{}});
