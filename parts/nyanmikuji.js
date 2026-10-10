/* ねこのて「今日のおみくじニャンコ」演出 v1（2026-10-11）
   使い方: NyanMikuji.play({fortune:'大吉', doc:parent.document, done:function(no){…}})
   絵は langue de chat のイラスト（parts/nyanko/NN.webp）。どの動きもゆっくり・控えめにする（ユーザー指示）。
   やめ方: 中の部品で NyanMikuji を呼ばなければ、今までどおりすぐ結果が出る。 */
(function(){
var BASE='https://raw.githubusercontent.com/6ntbryc57c-ctrl/nekonote-photos/main/parts/nyanko/';
var NOS=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
var SHOP='https://suzuri.jp/langue-de-chat';
var EASE='cubic-bezier(.33,.1,.25,1)';
var CSS=''
+'.ny-ov{position:fixed;inset:0;z-index:2147483000;overflow:hidden;opacity:0;cursor:pointer;background:radial-gradient(ellipse at 50% 55%,rgba(40,80,60,.9),rgba(5,16,11,.94));-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);font-family:"Mochiy Pop One","Hiragino Maru Gothic ProN","Hiragino Sans",sans-serif;-webkit-user-select:none;user-select:none}'
+'.ny-ov *{box-sizing:border-box}'
+'.ny-t{position:absolute;left:0;right:0;text-align:center;color:#fff8e6;letter-spacing:.04em;line-height:1.2;opacity:0;pointer-events:none;padding:0 12px;'
+'text-shadow:0 0 0 #000,2px 0 #e0832a,-2px 0 #e0832a,0 2px #e0832a,0 -2px #e0832a,2px 2px #e0832a,-2px 2px #e0832a,2px -2px #e0832a,-2px -2px #e0832a,0 5px 0 #8a4a17,0 8px 18px rgba(0,0,0,.45)}'
+'.ny-title{top:max(4vh,14px);font-size:clamp(22px,6.2vw,42px)}'
+'.ny-big{bottom:max(9vh,40px);font-size:clamp(30px,9vw,64px)}'
+'.ny-kore{top:52%;margin-top:-.62em;font-size:clamp(58px,17vw,132px);color:#fff3c4;white-space:nowrap}'
+'.ny-pic{position:absolute;left:50%;top:52%;width:min(86vw,62vh,560px);height:min(86vw,62vh,560px);margin:calc(min(86vw,62vh,560px)/-2) 0 0 calc(min(86vw,62vh,560px)/-2);opacity:0;pointer-events:none}'
+'.ny-pic img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 14px 26px rgba(0,0,0,.45))}'
+'.ny-puff{position:absolute;width:44vmin;aspect-ratio:1.25;left:50%;top:50%;margin:-17.6vmin 0 0 -22vmin;opacity:0;pointer-events:none;filter:blur(1.5px);'
+'background:radial-gradient(circle at 30% 62%,#fff 0 20%,rgba(255,255,255,0) 33%),radial-gradient(circle at 52% 40%,#fff 0 24%,rgba(255,255,255,0) 37%),radial-gradient(circle at 72% 60%,#fbfbf8 0 19%,rgba(255,255,255,0) 32%),radial-gradient(ellipse at 50% 72%,#e9e9e2 0 28%,rgba(233,233,226,0) 45%)}'
+'.ny-rays{position:absolute;left:50%;top:50%;width:190vmax;height:190vmax;margin:-95vmax 0 0 -95vmax;opacity:0;pointer-events:none;mix-blend-mode:screen;'
+'background:radial-gradient(circle,rgba(255,250,220,.95) 0 5%,rgba(255,236,160,.55) 12%,rgba(255,220,120,0) 26%),repeating-conic-gradient(rgba(255,238,170,.75) 0 7deg,rgba(255,230,150,.08) 7deg 18deg);'
+'-webkit-mask:radial-gradient(circle,#000 8%,rgba(0,0,0,.6) 22%,transparent 40%);mask:radial-gradient(circle,#000 8%,rgba(0,0,0,.6) 22%,transparent 40%)}'
+'.ny-slip{position:absolute;left:50%;top:50%;width:min(34vw,170px);margin-left:calc(min(34vw,170px)/-2);opacity:0;pointer-events:none;padding:16px 10px 26px;background:linear-gradient(#fbf4e3,#efe2c3);color:#7a1f12;text-align:center;border-radius:5px;border:2px solid #d4af37;box-shadow:0 0 50px 12px rgba(255,232,150,.75),0 10px 24px rgba(0,0,0,.4);font-family:"Hiragino Mincho ProN","Yu Mincho",serif}'
+'.ny-slip:before{content:"";display:block;height:10px;margin:-16px -10px 14px;background:#b8322a;border-radius:3px 3px 0 0}'
+'.ny-slip small{display:block;font-size:clamp(10px,2.6vw,14px);letter-spacing:.2em;color:#8a6a3a}'
+'.ny-slip b{display:block;writing-mode:vertical-rl;margin:8px auto 0;font-weight:bold;font-size:clamp(40px,11vw,74px);line-height:1.1;letter-spacing:.05em}'
+'.ny-cr{position:absolute;left:0;right:0;bottom:max(2vh,8px);text-align:center;font:12px/1.4 -apple-system,"Hiragino Sans",sans-serif;color:rgba(255,248,230,.75);opacity:0}'
+'.ny-cr a{color:#f5c542;text-decoration:underline;cursor:pointer}'
+'.ny-skip{position:absolute;right:12px;top:10px;font:11px -apple-system,sans-serif;color:rgba(255,255,255,.45)}';

function play(o){
 var doc=o.doc||document,win=doc.defaultView||window,f=o.fortune,done=o.done||function(){};
 var no=NOS[Math.floor(Math.random()*NOS.length)];
 try{if(win.matchMedia&&win.matchMedia('(prefers-reduced-motion: reduce)').matches){done(no);return}}catch(e){}
 if(!doc.getElementById('ny-css')){var st=doc.createElement('style');st.id='ny-css';st.textContent=CSS;doc.head.appendChild(st);
  var ln=doc.createElement('link');ln.rel='stylesheet';ln.href='https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap&text='+encodeURIComponent('今日のおみくじニャンコどれにしようかな！？これニャ');doc.head.appendChild(ln)}
 var ov=doc.createElement('div');ov.className='ny-ov';
 ov.innerHTML='<div class="ny-rays"></div><div class="ny-pic"><img alt="langue de chat のねこ"></div>'
  +'<div class="ny-t ny-title">今日のおみくじニャンコ</div><div class="ny-t ny-big">どれにしようかな！？</div><div class="ny-t ny-kore">これニャ！</div>'
  +'<div class="ny-slip"><small>ねこみくじ</small><b></b></div>'
  +'<div class="ny-cr">イラスト：<a href="'+SHOP+'" target="_blank" rel="noopener">langue de chat</a>（SUZURI でグッズ販売中）</div><span class="ny-skip">押すと飛ばせます</span>';
 ov.querySelector('.ny-slip b').textContent=f;
 doc.body.appendChild(ov);
 var q=function(s){return ov.querySelector(s)},stop=false,anims=[];
 function A(el,kf,ms,ease,op){var a=el.animate(kf,Object.assign({duration:ms,easing:ease||EASE,fill:'forwards'},op||{}));anims.push(a);return a.finished}
 function L(el,kf,ms,op){var a=el.animate(kf,Object.assign({duration:ms,iterations:Infinity,easing:'ease-in-out'},op||{}));anims.push(a);return a}
 function W(ms){return new Promise(function(res,rej){setTimeout(function(){stop?rej(0):res()},ms)})}
 function end(){if(stop)return;stop=true;anims.forEach(function(a){try{a.cancel()}catch(e){}});ov.remove();done(no)}
 ov.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a'))return;end()});
 var pic=q('.ny-pic'),img=q('.ny-pic img'),title=q('.ny-title'),big=q('.ny-big'),kore=q('.ny-kore'),slip=q('.ny-slip'),rays=q('.ny-rays'),cr=q('.ny-cr');
 var loaded=new Promise(function(res){img.onload=function(){res(true)};img.onerror=function(){res(false)};setTimeout(function(){res(false)},5000)});
 img.src=BASE+(no<10?'0':'')+no+'.webp';
 (async function(){try{
  await A(ov,[{opacity:0},{opacity:1}],900);
  // 1 「今日のおみくじニャンコ」がふわっと出る
  A(cr,[{opacity:0},{opacity:1}],1200);
  await A(title,[{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)'}],1500);
  var ok=await loaded;if(stop)return;
  // 2 大きなイラストがゆっくり飛び出す（イラストはこのあと動かさない）
  if(ok)await A(pic,[{opacity:0,transform:'translateY(6%) scale(.35)'},{opacity:1,transform:'translateY(-1%) scale(1.03)',offset:.75},{opacity:1,transform:'translateY(0) scale(1)'}],2600);
  await W(500);
  // 3 「どれにしようかな！？」…文字だけがゆらゆら揺れる
  await A(big,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],1000);
  L(big,[{transform:'rotate(0)'},{transform:'rotate(-5deg)'},{transform:'rotate(0)'},{transform:'rotate(5deg)'},{transform:'rotate(0)'}],2400);
  await W(4800);
  // 4 「これニャ！」
  await A(big,[{opacity:1},{opacity:0}],700);
  // イラストの真ん中に、大きく「ドン」と出して、ゆらゆら
  await A(kore,[{opacity:0,transform:'scale(1.7)'},{opacity:1,transform:'scale(.94)',offset:.6},{opacity:1,transform:'scale(1)'}],1000,'cubic-bezier(.2,.7,.3,1)');
  var sway=L(kore,[{transform:'rotate(0)'},{transform:'rotate(-4deg)'},{transform:'rotate(0)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}],2000);
  await W(2000);sway.cancel();
  // 文字がくるっと1回転しながら、煙が出はじめる
  A(kore,[{opacity:1,transform:'rotate(0) scale(1)'},{opacity:1,transform:'rotate(300deg) scale(1.05)',offset:.75},{opacity:0,transform:'rotate(360deg) scale(.9)'}],1700,'cubic-bezier(.45,.05,.4,1)');
  await W(500);
  // 5 白い煙がもくもく…絵と文字は煙の中へ
  A(pic,[{opacity:1},{opacity:0}],1800,EASE,{delay:600});A(title,[{opacity:1},{opacity:0}],1200,EASE,{delay:300});
  for(var p=0;p<24;p++){var d=doc.createElement('div');d.className='ny-puff';ov.insertBefore(d,slip);
   var an=p/24*Math.PI*2+Math.random()*.5,r=(p<7?4+Math.random()*10:26+Math.random()*30),dx=Math.cos(an)*r*1.5,dy=Math.sin(an)*r*.9,
    s1=1.1+Math.random()*.8,s2=1.9+Math.random()*1.1,rot=(Math.random()-.5)*60;
   A(d,[{opacity:0,transform:'translate(0,0) scale(.25)'},{opacity:1,transform:'translate('+dx*.55+'%,'+dy*.55+'%) scale('+s1+') rotate('+rot*.4+'deg)',offset:.22},
     {opacity:.95,transform:'translate('+dx+'%,'+dy+'%) scale('+(s1+.4)+') rotate('+rot*.7+'deg)',offset:.52},{opacity:0,transform:'translate('+dx*1.5+'%,'+(dy*1.5-16)+'%) scale('+s2+') rotate('+rot+'deg)'}],7000,'cubic-bezier(.25,.6,.4,1)',{delay:p*60})}
  // 6 煙の奥から、おみくじがゆっくり、おごそかに姿をあらわす
  await W(1600);
  A(rays,[{opacity:0},{opacity:1}],2600,'ease-in',{delay:600});
  L(rays,[{transform:'rotate(0)'},{transform:'rotate(360deg)'}],30000,{easing:'linear'});
  await A(slip,[{opacity:0,transform:'translateY(-40%) scale(.55)',filter:'blur(6px) brightness(1.6)'},
   {opacity:.6,transform:'translateY(-48%) scale(.85)',filter:'blur(3px) brightness(1.4)',offset:.45},
   {opacity:1,transform:'translateY(-52%) scale(1.05)',filter:'blur(0) brightness(1.15)',offset:.82},
   {opacity:1,transform:'translateY(-50%) scale(1)',filter:'blur(0) brightness(1)'}],4600);
  L(slip,[{transform:'translateY(-50%)'},{transform:'translateY(-52%)'},{transform:'translateY(-50%)'}],3000);
  await W(3200);
  await A(ov,[{opacity:1},{opacity:0}],900);
  end();
 }catch(e){end()}})();
}
window.NyanMikuji={play:play,NOS:NOS,BASE:BASE,SHOP:SHOP};
})();
