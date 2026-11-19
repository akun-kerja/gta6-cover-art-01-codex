const canvas = document.querySelector('#poster');
const ctx = canvas.getContext('2d');
const fileInput = document.querySelector('#photo');
const caption = document.querySelector('#caption');
const panels = [
  { name: 'MAIN CHARACTER', image: null, url: './samples/boulevard.jpg', zoom: 1, x: .5, y: .5 },
  { name: 'THE GETAWAY', image: null, url: './samples/pier.jpg', zoom: 1.15, x: .52, y: .5 },
  { name: 'AFTER HOURS', image: null, url: './samples/boulevard.jpg', zoom: 1.45, x: .25, y: .45 },
];
const formats = { portrait: [1080, 1350], square: [1080, 1080], landscape: [1920, 1080] };
const grades = {
  sunset: { name: 'GOLDEN HOUR', colors: ['#f9bd72', '#f36e79', '#554e90'], wash: 'rgba(247,102,117,.12)' },
  neon: { name: 'NEON NIGHT', colors: ['#19cbbd', '#6857dc', '#ea459f'], wash: 'rgba(43,60,170,.2)' },
  rose: { name: 'ROSE DUSK', colors: ['#f3b49a', '#b3578a', '#493f79'], wash: 'rgba(190,71,132,.15)' },
  noir: { name: 'NOIR CITY', colors: ['#d5c8ae', '#77717d', '#191820'], wash: 'rgba(14,13,23,.43)' },
};
let format = 'portrait';
let mood = 'sunset';
let activePanel = 0;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function fillCrop(image, rect, state) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  const scale = Math.max(rect.w / image.width, rect.h / image.height) * state.zoom;
  const w = image.width * scale;
  const h = image.height * scale;
  const left = rect.x + rect.w * state.x - w * state.x;
  const top = rect.y + rect.h * state.y - h * state.y;
  ctx.drawImage(image, left, top, w, h);
  ctx.fillStyle = grades[mood].wash;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function paint() {
  const [w, h] = formats[format];
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const scale = w / 1080;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = '#111018';
  ctx.fillRect(0, 0, 1080, h / scale);
  const fullH = h / scale;
  const pad = format === 'landscape' ? 38 : 42;
  const top = format === 'landscape' ? 75 : 45;
  const footerH = format === 'portrait' ? 285 : format === 'square' ? 245 : 180;
  const gridH = fullH - top - footerH - pad;
  const gap = 9;
  const heroW = format === 'landscape' ? 617 : 585;
  const sideW = 1080 - pad * 2 - heroW - gap;
  const hero = { x: pad, y: top, w: heroW, h: gridH };
  const side = { x: pad + heroW + gap, y: top, w: sideW, h: (gridH - gap) / 2 };
  for (const [index, rect] of [[0, hero], [1, side], [2, { ...side, y: side.y + side.h + gap }]]) {
    const item = panels[index];
    if (item.image) fillCrop(item.image, rect, item);
    else { ctx.fillStyle = '#35303b'; ctx.fillRect(rect.x, rect.y, rect.w, rect.h); }
    ctx.strokeStyle = 'rgba(255,232,222,.62)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2);
  }
  const g = ctx.createLinearGradient(0, 0, 1080, fullH);
  grades[mood].colors.forEach((color, i) => g.addColorStop(i / 2, color));
  ctx.globalAlpha = .86;
  ctx.fillStyle = g;
  ctx.fillRect(0, fullH - footerH - 3, 1080, footerH + 3);
  ctx.globalAlpha = 1;
  const fade = ctx.createLinearGradient(0, fullH - footerH - 60, 0, fullH);
  fade.addColorStop(0, 'rgba(15,13,21,0)'); fade.addColorStop(.32, 'rgba(15,13,21,.62)'); fade.addColorStop(1, 'rgba(12,11,17,.96)');
  ctx.fillStyle = fade; ctx.fillRect(0, fullH - footerH - 60, 1080, footerH + 60);
  const title = (caption.value || 'YOUR NIGHT').toUpperCase().trim();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff5e8';
  ctx.font = `900 ${format === 'landscape' ? 112 : 100}px Arial, Helvetica, sans-serif`;
  ctx.shadowColor = 'rgba(22,8,24,.45)'; ctx.shadowBlur = 7; ctx.shadowOffsetY = 4;
  const maxWidth = 970;
  let size = format === 'landscape' ? 112 : 100;
  while (ctx.measureText(title).width > maxWidth && size > 52) { size -= 2; ctx.font = `900 ${size}px Arial, Helvetica, sans-serif`; }
  const titleBase = fullH - footerH + (format === 'landscape' ? 79 : 108);
  ctx.fillText(title, pad, titleBase);
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#ffd680'; ctx.fillRect(pad, fullH - footerH + (format === 'landscape' ? 96 : 132), 64, 5);
  ctx.font = '700 20px Arial, Helvetica, sans-serif'; ctx.letterSpacing = '5px';
  ctx.fillStyle = '#f4dce0'; ctx.fillText('VICE CITY  ·  AFTER DARK', pad, fullH - footerH + (format === 'landscape' ? 128 : 174));
  ctx.font = '11px Arial, Helvetica, sans-serif'; ctx.letterSpacing = '3px';
  const footerBase = fullH - (format === 'landscape' ? 17 : 30);
  ctx.fillStyle = 'rgba(250,239,236,.7)'; ctx.fillText('A NIGHT THAT BELONGS TO YOU', pad, footerBase);
  ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(250,239,236,.68)'; ctx.fillText('FLORIDA  /  26° 08′ N', 1080 - pad, footerBase); ctx.textAlign = 'left';
}

function posterFrames() {
  const fullH = formats[format][1] / (formats[format][0] / 1080);
  const pad = format === 'landscape' ? 38 : 42;
  const top = format === 'landscape' ? 75 : 45;
  const footerH = format === 'portrait' ? 285 : format === 'square' ? 245 : 180;
  const gridH = fullH - top - footerH - pad;
  const gap = 9;
  const heroW = format === 'landscape' ? 617 : 585;
  const sideW = 1080 - pad * 2 - heroW - gap;
  const sideH = (gridH - gap) / 2;
  const sideX = pad + heroW + gap;
  return [{ x: pad, y: top, w: heroW, h: gridH }, { x: sideX, y: top, w: sideW, h: sideH }, { x: sideX, y: top + sideH + gap, w: sideW, h: sideH }];
}

let drag = null;
canvas.addEventListener('pointerdown', event => {
  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * canvas.width / bounds.width / (canvas.width / 1080);
  const y = (event.clientY - bounds.top) * canvas.height / bounds.height / (canvas.width / 1080);
  const frame = posterFrames().findIndex(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  if (frame < 0) return;
  activePanel = frame;
  drag = { frame, x: event.clientX, y: event.clientY };
  canvas.setPointerCapture(event.pointerId);
  canvas.style.cursor = 'grabbing';
});
canvas.addEventListener('pointermove', event => {
  if (!drag) return;
  const rect = posterFrames()[drag.frame];
  const bounds = canvas.getBoundingClientRect();
  const item = panels[drag.frame];
  item.x = Math.min(1, Math.max(0, item.x - (event.clientX - drag.x) * bounds.width / rect.w / 1080));
  item.y = Math.min(1, Math.max(0, item.y - (event.clientY - drag.y) * bounds.height / rect.h / (canvas.height / (canvas.width / 1080))));
  drag.x = event.clientX; drag.y = event.clientY;
  paint();
});
canvas.addEventListener('pointerup', () => { drag = null; canvas.style.cursor = 'grab'; });
canvas.addEventListener('wheel', event => {
  event.preventDefault();
  const item = panels[activePanel];
  item.zoom = Math.min(2.6, Math.max(.8, item.zoom + (event.deltaY < 0 ? .08 : -.08)));
  paint();
}, { passive: false });

function updateRows() {
  document.querySelector('#panelList').innerHTML = panels.map((item, index) => `<div class="photo-row"><img class="thumb" src="${item.preview || item.url}" alt=""><div><div class="row-title">${item.name}</div><div class="row-sub">${item.custom ? 'YOUR PHOTO · PRIVATE' : 'SAMPLE PHOTO'}</div></div><button class="crop-button" type="button" data-panel="${index}">CHANGE PHOTO ↗</button></div>`).join('');
  document.querySelectorAll('.crop-button').forEach(button => button.addEventListener('click', () => { activePanel = Number(button.dataset.panel); fileInput.click(); }));
}

async function useSamples() {
  for (const panel of panels) { panel.image = await loadImage(panel.url); panel.preview = panel.url; panel.custom = false; }
  updateRows(); paint();
}

document.querySelector('#panelList').addEventListener('click', event => {
  if (event.target.id === 'panelList') return;
});
document.querySelector('#useSamples').addEventListener('click', useSamples);
fileInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  try { panels[activePanel].image = await loadImage(url); panels[activePanel].preview = url; panels[activePanel].custom = true; updateRows(); paint(); }
  finally { fileInput.value = ''; }
});
caption.addEventListener('input', paint);
document.querySelectorAll('.format').forEach(button => button.addEventListener('click', () => {
  format = button.dataset.format;
  document.querySelectorAll('.format').forEach(b => b.classList.toggle('active', b === button));
  const [w, h] = formats[format];
  document.querySelector('#formatSize').textContent = `${w} × ${h}`;
  document.querySelector('#previewDimensions').textContent = `${w} × ${h}`;
  paint();
}));
document.querySelectorAll('.mood').forEach(button => button.addEventListener('click', () => {
  mood = button.dataset.mood;
  document.querySelectorAll('.mood').forEach(b => b.classList.toggle('active', b === button));
  document.querySelector('#moodName').textContent = grades[mood].name;
  paint();
}));
document.querySelector('#export').addEventListener('click', () => canvas.toBlob(blob => {
  if (!blob) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vice-city-${formats[format][0]}x${formats[format][1]}.png`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}, 'image/png'));
updateRows();
useSamples();
canvas.style.cursor = 'grab';
