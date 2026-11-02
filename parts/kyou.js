/* 今日はなんの日（ねこのて・GitHub の parts/kyou.js）。② 中 の部品が読み込み、同じ部品の中の枠（#kt・#kbody）に書く。
   2026-11-02：Ameba Ownd が部品を閉じた箱（sandbox）にしたため、前の ⑤ から ② へ書き込む形が動かなくなった。② の中だけで動く形に作り直した。 */
window.NekoKyou = { run: function (document) {
var jp=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Tokyo'}));
var M=jp.getMonth()+1,D=jp.getDate(),page=M+'月'+D+'日',Y=jp.getFullYear();
var API='https://ja.wikipedia.org/w/api.php?format=json&origin=*&page='+encodeURIComponent(page);
var pageUrl='https://ja.wikipedia.org/wiki/'+encodeURIComponent(page);
var NP='https://raw.githubusercontent.com/6ntbryc57c-ctrl/nekonote-photos/main/parts/nophoto.png';
var kt=document.getElementById('kt'),kb=document.getElementById('kbody');
if(!kt||!kb)return;
kt.textContent='今日はなんの日？（'+page+'）';
var items=[],pos=0,timer;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fail(){kb.innerHTML='<a href="'+pageUrl+'" target="_blank" rel="noopener">'+page+'の記念日を見る</a>'}
function thumb(it){
if(it.img!==undefined)return Promise.resolve(it);
var tries=[];if(it.link)tries.push(it.link);var base=it.name.replace(/(の日|デー|記念日)$/,'');if(base&&tries.indexOf(base)<0)tries.push(base);
var p=Promise.resolve(null);
tries.forEach(function(t){p=p.then(function(found){if(found)return found;return fetch('https://ja.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(t)).then(function(r){return r.ok?r.json():null}).then(function(j){return j&&j.thumbnail&&j.type!=='disambiguation'?j.thumbnail.source:null}).catch(function(){return null})})});
return p.then(function(src){it.img=src||null;return it});
}
function auto(){clearInterval(timer);timer=setInterval(function(){pos++;show()},8000)}
function show(){
if(!items.length)return fail();
thumb(items[pos%items.length]).then(function(it){
kb.innerHTML='<div class="kr"><img src="'+esc(it.img||NP)+'" alt="'+esc(it.name)+'"><div><div class="nm">'+esc(it.name)+'</div><div class="dd">'+esc(it.desc||'')+'</div></div></div>'+
'<button class="more" type="button" id="knext">ほかの記念日 ▶</button>'+
'<div class="src">出典：<a href="'+pageUrl+'" target="_blank" rel="noopener">ウィキペディア</a>（CC BY-SA）</div>';
var im=kb.querySelector('img');im.addEventListener('error',function(){if(im.src!==NP)im.src=NP});
document.getElementById('knext').addEventListener('click',function(){pos++;show();auto()});
thumb(items[(pos+1)%items.length]).then(function(n){if(n.img){new Image().src=n.img}});
});
}
fetch(API+'&action=parse&prop=sections').then(function(r){return r.json()}).then(function(j){
var sec=(j.parse&&j.parse.sections||[]).filter(function(s){return /記念日/.test(s.line)})[0];
if(!sec)throw 0;
return fetch(API+'&action=parse&prop=text&disablelimitreport=1&section='+sec.index).then(function(r){return r.json()});
}).then(function(j){
var doc=new DOMParser().parseFromString(j.parse.text['*'],'text/html');
doc.querySelectorAll('sup').forEach(function(s){s.remove()});
doc.querySelectorAll('li').forEach(function(li){
var lines=li.textContent.split('\n').map(function(s){return s.trim()}).filter(Boolean);
if(!lines.length||!/日本/.test(lines[0])||/^[\^＾↑]/.test(lines[0]))return;
// かっこの中に年がある記念日は、今年が当てはまるときだけ出す
var ym=lines[0].match(/[（(]([^）)]*)/),ok=1;if(ym&&/\d{4}/.test(ym[1])){ok=0;ym[1].replace(/(\d{4})年?\s*[-–〜～]\s*(\d{4})?|(\d{4})/g,function(x,a,b,c){if(c?+c==Y:Y>=+a&&(!b||Y<=+b))ok=1})}if(!ok)return;
var name=lines[0].replace(/[（(].*$/,'').trim();if(!name)return;
var link=null;li.querySelectorAll('a').forEach(function(a){var t=a.textContent.trim();if(!link&&t&&name.indexOf(t)>=0){var hr=a.getAttribute('href')||'';if(hr.indexOf('/wiki/')===0)link=decodeURIComponent(hr.slice(6))}});
var desc=lines.slice(1).filter(function(x){return !/^[\^＾↑]/.test(x)}).join(' ');var cut=desc.indexOf('。');if(cut>0)desc=desc.slice(0,cut+1);if(desc.length>60)desc=desc.slice(0,58)+'…';
items.push({name:name,link:link,desc:desc});
});
for(var i=items.length-1;i>0;i--){var r=Math.floor(Math.random()*(i+1));var t=items[i];items[i]=items[r];items[r]=t}
show();auto();
}).catch(fail);
setTimeout(function(){if(kb.textContent==='読み込み中…')fail()},8000);
}};
