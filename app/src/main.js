const canvas = document.querySelector('#poster');
if(new URLSearchParams(location.search).has('cover'))document.body.classList.add('poster-only');
const caption = document.querySelector('#caption');
const format = document.querySelector('#format');
const grade = document.querySelector('#grade');
const photos = [];
const crops = [{x:0,y:0},{x:0,y:0},{x:0,y:0}];
const samples = ['boulevard.jpg','pier.jpg','boulevard.jpg'];
const sceneNames = ['Ocean Drive','Last light','Blue hour'];
let selectedPanel = 0;
let drag = null;
let timer;
const palettes = {
  heat:{top:'#ff725f',bottom:'#872982',glow:'#ffba69',ink:'#261729',wash:'rgba(255,92,114,.17)'},
  electric:{top:'#27c2df',bottom:'#292c83',glow:'#91efff',ink:'#111729',wash:'rgba(23,145,255,.19)'},
  noir:{top:'#ed9875',bottom:'#30204e',glow:'#ffd2a3',ink:'#201821',wash:'rgba(31,18,48,.3)'}
};
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}
function getDims(){return format.value==='portrait'?[1080,1350]:format.value==='landscape'?[1920,1080]:[1080,1080]}
function paths(w,h){
  // Three editorial frames lock together around a clean, caption-ready lower band.
  return [{x:0,y:0,w:.62,h:.59},{x:.625,y:0,w:.375,h:.59},{x:0,y:.595,w:.49,h:.405},{x:.495,y:.595,w:.505,h:.405}].map(p=>({x:p.x*w,y:p.y*h,w:p.w*w,h:p.h*h}));
}
function render(target=canvas, dimensions=null){
  const [w,h]=dimensions??getDims();target.width=w;target.height=h;
  const g=palettes[grade.value], frames=paths(w,h);
  const c=target.getContext('2d');
  c.fillStyle=g.ink;c.fillRect(0,0,w,h);
  frames.forEach((box,i)=>{
    c.save();c.beginPath();c.rect(box.x,box.y,box.w,box.h);c.clip();
    const img=photos[i%3];
    if(img)drawPhotoOn(c,img,box,crops[i%3]);else {c.fillStyle=g.ink;c.fillRect(box.x,box.y,box.w,box.h)}
    const wash=c.createLinearGradient(box.x,box.y,box.x+box.w*.6,box.y+box.h);wash.addColorStop(0,'rgba(27,14,34,.04)');wash.addColorStop(1,g.wash);c.fillStyle=wash;c.fillRect(box.x,box.y,box.w,box.h);
    c.restore();
  });
  const gap=Math.max(3,w*.005);c.fillStyle='#171419';c.fillRect(w*.62,0,gap,h);c.fillRect(0,h*.59,w,gap);
  // Shared color veil gives the separate snapshots the same warm dusk atmosphere.
  const veil=c.createLinearGradient(0,h*.48,0,h);veil.addColorStop(0,'rgba(19,13,28,0)');veil.addColorStop(.48,'rgba(27,12,35,.22)');veil.addColorStop(1,'rgba(23,12,30,.62)');c.fillStyle=veil;c.fillRect(0,h*.38,w,h*.62);
  drawType(c,w,h,g);
  c.strokeStyle='rgba(255,244,232,.65)';c.lineWidth=Math.max(2,w*.003);c.strokeRect(w*.018,h*.018,w*.964,h*.964);
}
function drawPhotoOn(c,img,box,offset){const scale=Math.max(box.w/img.naturalWidth,box.h/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;const ox=Math.max(0,Math.min(1,.5+offset.x))*(dw-box.w),oy=Math.max(0,Math.min(1,.5+offset.y))*(dh-box.h);c.drawImage(img,box.x-ox,box.y-oy,dw,dh)}
function drawType(c,w,h,g){
  const text=caption.value.trim().toUpperCase();
  c.save();c.textAlign='left';c.textBaseline='bottom';
  c.fillStyle=g.glow;c.font=`700 ${Math.round(h*.025)}px Arial, sans-serif`;c.letterSpacing=`${Math.round(w*.006)}px`;c.fillText('V I C E   C I T Y     /     FLORIDA',w*.064,h*.82);
  c.fillStyle='#fff8ed';let size=h*.108;c.font=`900 ${size}px Georgia, 'Times New Roman', serif`;
  while(c.measureText(text).width>w*.87&&size>18){size*=.94;c.font=`900 ${size}px Georgia, 'Times New Roman', serif`}
  c.shadowColor='rgba(26,10,23,.38)';c.shadowBlur=size*.16;c.fillText(text,w*.06,h*.94);
  c.shadowBlur=0;c.fillStyle='#ff8791';c.fillRect(w*.064,h*.956,w*.16,Math.max(3,h*.006));c.restore();
}
function redraw(){render();document.querySelector('#charCount').textContent=`${caption.value.length} / 28`;const [w,h]=getDims();canvas.style.aspectRatio=`${w} / ${h}`;document.querySelector('#dimensions').textContent=`${w} × ${h} PX`}
function toast(message){const status=document.querySelector('#status');status.textContent=message;status.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>status.classList.remove('show'),2500)}
function setPanelImage(i,img,name){photos[i]=img;sceneNames[i]=name;document.querySelector(`#name${i}`).textContent=name;const t=document.querySelector(`#thumb${i}`);t.style.backgroundImage=`url("${img.src}")`;redraw()}
async function initialize(){
  for(let i=0;i<3;i++){const img=await loadImage(`./samples/${samples[i]}`);setPanelImage(i,img,sceneNames[i])}
  document.querySelectorAll('.filepick').forEach(input=>input.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file);try{const img=await loadImage(url);setPanelImage(+input.dataset.panel,img,file.name.replace(/\.[^.]+$/,'').slice(0,20));toast('Photo added to your scene')}catch{toast('That image could not be opened')}finally{URL.revokeObjectURL(url);input.value=''}}));
  document.querySelectorAll('.replace').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();document.querySelector(`.filepick[data-panel="${b.dataset.panel}"]`).click()}));
  caption.addEventListener('input',redraw);format.addEventListener('change',redraw);grade.addEventListener('change',redraw);
  document.querySelector('#shuffle').addEventListener('click',async()=>{for(let i=0;i<3;i++){const img=await loadImage(`./samples/${samples[(i+1)%samples.length]}`);setPanelImage(i,img,['Ocean Drive','Last light','Blue hour'][i])}toast('Sample scenes restored')});
  canvas.addEventListener('pointerdown',e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width,y=(e.clientY-rect.top)/rect.height;selectedPanel=y<.59?(x<.62?0:1):(x<.49?2:0);drag={x:e.clientX,y:e.clientY,panel:selectedPanel};canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const rect=canvas.getBoundingClientRect(),im=photos[drag.panel];if(!im)return;const box=paths(canvas.width,canvas.height)[drag.panel],scale=Math.max(box.w/im.naturalWidth,box.h/im.naturalHeight),overX=Math.max(1,im.naturalWidth*scale-box.w),overY=Math.max(1,im.naturalHeight*scale-box.h);crops[drag.panel].x=Math.max(-.5,Math.min(.5,crops[drag.panel].x-(e.clientX-drag.x)*canvas.width/rect.width/overX));crops[drag.panel].y=Math.max(-.5,Math.min(.5,crops[drag.panel].y-(e.clientY-drag.y)*canvas.height/rect.height/overY));drag.x=e.clientX;drag.y=e.clientY;redraw()});
  canvas.addEventListener('pointerup',()=>drag=null);
  document.querySelector('#export').addEventListener('click',()=>{const [w,h]=getDims(),out=document.createElement('canvas');render(out,[w,h]);out.toBlob(blob=>{if(!blob){toast('Could not create poster');return}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`vice-versa-${w}x${h}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast(`Poster exported · ${w} × ${h}`)},'image/png')});
  redraw();
}
initialize().catch(()=>toast('Could not load local sample scenes'));
